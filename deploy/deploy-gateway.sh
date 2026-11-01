#!/usr/bin/env bash
# Installed root-owned outside releases. The CI SSH key may only invoke this gateway.
set -Eeuo pipefail
umask 077
ROOT=/opt/loy-krathong-live
mkdir -p "$ROOT/shared" "$ROOT/releases"
exec 9>"$ROOT/deploy.lock"
flock -w 300 9
case "${SSH_ORIGINAL_COMMAND:-}" in
  configure)
    python3 -c '
import json, os, sys, tempfile
allowed = {"MONGODB_URI", "MONGODB_DATABASE", "ADMIN_PASSWORD", "COOKIE_SECURE", "PUBLIC_ORIGIN", "S3_ENDPOINT", "S3_REGION", "S3_BUCKET", "S3_ACCESS_KEY", "S3_SECRET_KEY", "S3_PUBLIC_URL"}
data=json.load(sys.stdin)
if set(data) != allowed: sys.exit("Invalid environment keys")
if any(not isinstance(v,str) or "\n" in v or "\r" in v or "\x00" in v for v in data.values()): sys.exit("Invalid environment values")
if len(data["ADMIN_PASSWORD"]) < 12 or not data["MONGODB_URI"].startswith("mongodb"): sys.exit("Invalid production credentials")
path="/opt/loy-krathong-live/shared/runtime.env"
fd, temp=tempfile.mkstemp(dir=os.path.dirname(path))
with os.fdopen(fd,"w") as f:
    for k,v in data.items(): f.write(k+"="+v+"\n")
if os.path.exists(path):
    import shutil
    shutil.copyfile(path,path+".previous")
    os.chmod(path+".previous",0o600)
os.replace(temp,path)
os.chmod(path,0o600)
'
    echo 'Runtime configuration saved.'
    ;;
  deploy\ *)
    SHA="${SSH_ORIGINAL_COMMAND#deploy }"
    [[ "$SHA" =~ ^[a-f0-9]{40}$ ]] || { echo 'Invalid release ID'; exit 1; }
    test -s "$ROOT/shared/runtime.env"
    DEST="$ROOT/releases/$SHA"
    mkdir -p "$DEST"
    ARCHIVE=$(mktemp "$ROOT/release.XXXXXX.tar.gz")
    trap 'rm -f "$ARCHIVE"' EXIT
    cat > "$ARCHIVE"
    # Reject archive traversal; only the compiled application and runtime definition are accepted.
    python3 -c '
import tarfile,sys,posixpath
with tarfile.open(sys.argv[1],"r:gz") as archive:
    for m in archive.getmembers():
        p=posixpath.normpath(m.name)
        if p.startswith("/") or p==".." or p.startswith("../"): sys.exit("Unsafe archive path")
        if not (p==".output" or p.startswith(".output/") or p in {"dist/api.mjs","deploy/Dockerfile","deploy/compose.prod.yaml"}): sys.exit("Unexpected archive entry: "+p)
        if m.islnk() or m.issym():
            target=posixpath.normpath(posixpath.join(posixpath.dirname(p),m.linkname))
            if m.linkname.startswith("/") or target.startswith("../"): sys.exit("Unsafe archive link")
' "$ARCHIVE"
    tar --extract --gzip --file "$ARCHIVE" --directory "$DEST" --no-same-owner --no-same-permissions
    # Public release files are read by an unprivileged container user.
    chmod -R a+rX "$DEST"
    export RELEASE_ID="$SHA"
    docker build --tag "loy-krathong-live:$SHA" --file "$DEST/deploy/Dockerfile" "$DEST"
    PREVIOUS=$(readlink -f "$ROOT/current" || true)
    rollback() {
      echo 'Health check failed; restoring the previous release.' >&2
      if [[ -n "$PREVIOUS" && -f "$PREVIOUS/deploy/compose.prod.yaml" ]]; then
        if [[ -f "$ROOT/shared/runtime.env.previous" ]]; then cp "$ROOT/shared/runtime.env.previous" "$ROOT/shared/runtime.env"; fi
        RELEASE_ID=$(basename "$PREVIOUS") docker compose -p loy-krathong-live -f "$PREVIOUS/deploy/compose.prod.yaml" up -d --wait --wait-timeout 120
      else
        docker compose -p loy-krathong-live -f "$DEST/deploy/compose.prod.yaml" down
      fi
      exit 1
    }
    if ! docker compose -p loy-krathong-live -f "$DEST/deploy/compose.prod.yaml" up -d --wait --wait-timeout 120; then rollback; fi
    if ! curl --fail --silent --max-time 15 http://127.0.0.1:4310/api/state > /dev/null; then rollback; fi
    ln -sfn "$DEST" "$ROOT/current"
    echo "Deployed $SHA (127.0.0.1:4310)."
    ;;
  *) echo 'Only configure and deploy <commit-sha> are permitted.' >&2; exit 1 ;;
esac
