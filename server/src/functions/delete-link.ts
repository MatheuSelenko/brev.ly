import { eq } from 'drizzle-orm'
import { db } from "../db"
import { schema } from "../db/schemas"
import { LinkNotFoundError } from './errors/link-not-found-error'

type DeleteLinkInput = {
    id: string
}

export async function deleteLink({ id }: DeleteLinkInput) {
    const [link] = await db
        .delete(schema.links)
        .where(eq(schema.links.id, id))
        .returning()

    if (!link) {
        throw new LinkNotFoundError()
    }

    return link
}