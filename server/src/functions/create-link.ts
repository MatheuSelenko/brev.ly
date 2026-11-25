import { eq } from 'drizzle-orm'
import { db } from "../db"
import { schema } from "../db/schemas"

export class ShortUrlAlreadyExistsError extends Error {
    constructor() {
        super('Short URL already exists.')
    }
}

type CreateLinkInput = {
    originalUrl: string
    shortUrl: string
}

export async function createLink({ originalUrl, shortUrl }: CreateLinkInput) {
    const [existing] = await db
        .select()
        .from(schema.links)
        .where(eq(schema.links.shortUrl, shortUrl))
        .limit(1)

    if (existing) {
        throw new ShortUrlAlreadyExistsError()
    }

    const [link] = await db
    .insert(schema.links)
    .values({ originalUrl, shortUrl })
    .returning()

    return link
}