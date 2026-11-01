const production = process.argv[2] === 'start'
const env = { ...process.env, ...(production ? { NODE_ENV: 'production' } : {}) }
const processes = [
  Bun.spawn(['bun', ...(production ? [] : ['--watch']), 'api/main.ts'], { env, stdout: 'inherit', stderr: 'inherit' }),
  Bun.spawn(production ? ['node', '.output/server/index.mjs'] : ['node', 'node_modules/nuxt/bin/nuxt.mjs', 'dev', '--host', '0.0.0.0'], { env, stdout: 'inherit', stderr: 'inherit' })
]
const stop=()=>processes.forEach(p=>p.kill())
process.on('SIGINT',stop);process.on('SIGTERM',stop)
const code = await Promise.race(processes.map(p=>p.exited));stop();process.exit(code)
