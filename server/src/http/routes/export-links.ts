import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { exportLinks } from '../../functions/export-links'

export const exportLinksRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/links/exports', async (request, reply) => {
        const { reportUrl } = await exportLinks()
        return reply.status(200).send({ reportUrl })
    })
}