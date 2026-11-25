import { eq } from 'drizzle-orm'
import { db } from "../db"
import { schema } from "../db/schemas"
import { LinkNotFoundError } from './errors/link-not-found-error'

type GetLinkInput = {
    shortUrl: string
}

export async function getOriginalUrl({ shortUrl }: GetLinkInput) {
    const [link] = await db
        .select()
        .from(schema.links)
        .where(eq(schema.links.shortUrl, shortUrl))
        .limit(1)

    if (!link) {
        throw new LinkNotFoundError()
    }

    return link
}