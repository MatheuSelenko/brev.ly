import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { getOriginalUrl } from "../../functions/get-original-url"
import { LinkNotFoundError } from "../../functions/errors/link-not-found-error"

export const getOriginalUrlRoute: FastifyPluginAsyncZod = async (server) => {
    server.get(
        "/links/:shortUrl",
        {
            schema: {
                params: z.object({
                    shortUrl: z.string()
                })
            }
        },
        async (request, reply) => {
            const { shortUrl } = request.params

            try {
                const result = await getOriginalUrl({ shortUrl })
                return reply.status(200).send(result)
            } catch (error) {
                if ( error instanceof LinkNotFoundError) {
                    return reply.status(404).send({ message: error.message })
                }
                throw error
            }
        }
    )
}