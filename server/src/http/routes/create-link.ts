import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { createLink, ShortUrlAlreadyExistsError } from "../../functions/create-link"

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.post(
        '/links',
        {
            schema: {
                body: z.object({
                    originalUrl: z.url(),
                    shortUrl: z
                        .string()
                        .min(3)
                        .max(50)
                        .regex(/^[a-z0-9-]+$/, 'Use only lowercase letters, numbers and hyphens'),
                })
            }
        },
        async (request, reply) => {
            try {
                const link = await createLink(request.body)
                return reply.status(201).send(link)
            } catch (error) {
                if ( error instanceof ShortUrlAlreadyExistsError) {
                    return reply.status(409).send({ message: error.message })
                }
                throw error
            }
        }
    )
}