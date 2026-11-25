import { eq, sql } from 'drizzle-orm'
import { db } from "../db"
import { schema } from "../db/schemas"
import { LinkNotFoundError } from './errors/link-not-found-error'

type IncrementLinkAccessInput = {
    id: string
}

export async function incrementLinkAccess({ id }: IncrementLinkAccessInput) {
    const [link] = await db
        .update(schema.links)
        .set({ accessCount: sql`${schema.links.accessCount} + 1` })
        .where(eq(schema.links.id, id))
        .returning()

    if (!link) {
        throw new LinkNotFoundError()
    }

    return link
}