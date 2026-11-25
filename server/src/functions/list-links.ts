import { desc } from 'drizzle-orm'
import { db } from "../db"
import { schema } from "../db/schemas"

export async function listLinks() {
    const links = await db
        .select()
        .from(schema.links)
        .orderBy(desc(schema.links.createdAt))

    return links
}