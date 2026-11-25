import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { incrementLinkAccess } from "../../functions/increment-link-access"
import { LinkNotFoundError } from "../../functions/errors/link-not-found-error"

export const incrementLinkAccessRoute: FastifyPluginAsyncZod = async (server) => {
    server.patch(
        '/links/:id/access',
        {
            schema: {
                params: z.object({
                    id: z.uuid()
                })
            }
        },
        async (request, reply) => {
            try {
                const link = await incrementLinkAccess(request.params)
                return reply.status(200).send(link)
            } catch (error) {
                if ( error instanceof LinkNotFoundError) {
                    return reply.status(404).send({ message: error.message })
                }
                throw error
            }
        }
    )
}