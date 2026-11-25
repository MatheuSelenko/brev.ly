import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { listLinks } from "../../functions/list-links"

export const listLinksRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/links', async (request, reply) => {
        const links = await listLinks()
        return reply.status(200).send(links)
    })
}
