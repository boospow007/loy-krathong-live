export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  return proxyRequest(event, `${config.apiInternalUrl}${event.path}`, {
    headers: {
      'x-event-client-ip': getRequestIP(event, { xForwardedFor: process.env.TRUST_PROXY === 'true' }) || 'unknown',
      'x-forwarded-host': getHeader(event, 'host') || ''
    }
  })
})
