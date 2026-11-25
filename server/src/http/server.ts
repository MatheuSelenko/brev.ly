import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { env } from '../env'

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.get('/health', async () => {
  return { ok: true }
})

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!!')
})