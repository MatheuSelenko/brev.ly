import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { env } from '../env'
import {
  serializerCompiler,
  validatorCompiler,
  hasZodFastifySchemaValidationErrors,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createLinkRoute } from './routes/create-link'
import { listLinksRoute } from './routes/list-links'
import { getOriginalUrlRoute } from './routes/get-original-url'
import { incrementLinkAccessRoute } from './routes/increment-link-access'
import { deleteLinkRoute } from './routes/delete-link'
import { exportLinksRoute } from './routes/export-links'

// const server = fastify()
const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.validation })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error.' })
})

server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
})

server.register(createLinkRoute)
server.register(listLinksRoute)
server.register(getOriginalUrlRoute)
server.register(incrementLinkAccessRoute)
server.register(deleteLinkRoute)
server.register(exportLinksRoute)

server.get('/health', async () => {
  return { ok: true }
})

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!!')
})
