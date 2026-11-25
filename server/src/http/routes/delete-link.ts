import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { LinkNotFoundError } from "../../functions/errors/link-not-found-error"
import { deleteLink } from "../../functions/delete-link"

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.delete(
        '/links/:id',
        {
            schema: {
                params: z.object({
                    id: z.uuid()
                })
            }
        },
        async (request, reply) => {
            try {
                await deleteLink(request.params)
                return reply.status(204).send()
            } catch (error) {
                if ( error instanceof LinkNotFoundError) {
                    return reply.status(404).send({ message: error.message })
                }
                throw error
            }
        }
    )
}