"""Serialize workflow environment to the SSH configure command without printing secrets."""
import json
import os
import sys
keys = ['MONGODB_URI', 'MONGODB_DATABASE', 'ADMIN_PASSWORD', 'COOKIE_SECURE', 'PUBLIC_ORIGIN', 'S3_ENDPOINT', 'S3_REGION', 'S3_BUCKET', 'S3_ACCESS_KEY', 'S3_SECRET_KEY', 'S3_PUBLIC_URL']
data = {key: os.environ.get(key, '') for key in keys}
for key in ['MONGODB_URI', 'MONGODB_DATABASE', 'ADMIN_PASSWORD', 'PUBLIC_ORIGIN']:
    if not data[key]:
        sys.exit('Missing required deployment secret: ' + key)
json.dump(data, sys.stdout)
