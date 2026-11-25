import { api } from './api'

export type Link = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export type CreateLinkInput = {
  originalUrl: string
  shortUrl: string
}

export function listLinks() {
  return api<Link[]>('/links')
}

export function createLink(data: CreateLinkInput) {
  return api<Link>('/links', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteLink(id: string) {
  return api<void>(`/links/${id}`, { method: 'DELETE' })
}

export function getLinkByShortUrl(shortUrl: string) {
  return api<Link>(`/links/${shortUrl}`)
}

export function incrementLinkAccess(id: string) {
  return api<Link>(`/links/${id}/access`, { method: 'PATCH' })
}

export function exportLinks() {
  return api<{ reportUrl: string }>('/links/exports', { method: 'POST' })
}