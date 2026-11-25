import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
// import { asc, count, desc, ilike } from 'drizzle-orm'
// import { z } from 'zod'
import { db, pg } from '../db'
import { schema } from '../db/schemas'
import { uploadFileToStorage } from '../storage/upload-file-to-storage'
// import { type Either, makeRight } from '@/infra/shared/either'

export async function exportLinks() {
    const { sql, params } = db
        .select({
            originalUrl: schema.links.originalUrl,
            shortUrl: schema.links.shortUrl,
            accessCount: schema.links.accessCount,
            createdAt: schema.links.createdAt,
        })
        .from(schema.links)
        .toSQL()

    const cursor = pg.unsafe(sql, params as string[]).cursor(50)

    const csv = stringify({
        delimiter: ',',
        header: true,
        columns: [
            { key: 'original_url', header: 'URL original' },
            { key: 'short_url', header: 'URL encurtada' },
            { key: 'access_count', header: 'Acessos' },
            { key: 'created_at', header: 'Criado em' },
        ],
        cast: {
            date: (value) => value.toISOString(),
        },
    })

    const uploadStream = new PassThrough()

    const convertToCSVPipeline = pipeline(
        cursor,
        new Transform({
            objectMode: true,
            transform(chunks: unknown[], encoding, callback) {
                for (const chunck of chunks) {
                    this.push(chunck)
                }
                callback()
            },
        }),
        csv,
        uploadStream
    )

    const upload = uploadFileToStorage({
        folder: 'downloads',
        fileName: 'links.csv',
        contentType: 'text/csv',
        contentStream: uploadStream
    })

    const [{ url }] = await Promise.all([upload, convertToCSVPipeline])

    return { reportUrl: url }
}