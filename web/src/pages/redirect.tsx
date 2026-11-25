import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import logoIcon from '../assets/logo-icon.svg'
import { ApiError } from '../http/api'
import { getLinkByShortUrl, incrementLinkAccess } from '../http/links'
import { NotFound } from './not-found'

export function Redirect() {
  const { shortUrl } = useParams()
  const hasRedirected = useRef(false)

  const { data: link, isError } = useQuery({
    queryKey: ['link', shortUrl],
    queryFn: () => getLinkByShortUrl(shortUrl ?? ''),
    enabled: !!shortUrl,
    retry: (failureCount, error) => {
      const isNotFound = error instanceof ApiError && error.status === 404
      return !isNotFound && failureCount < 3
    },
  })

  useEffect(() => {
    if (!link || hasRedirected.current) {
      return
    }

    hasRedirected.current = true

    incrementLinkAccess(link.id)
      .catch(() => {})
      .finally(() => {
        window.location.replace(link.originalUrl)
      })
  }, [link])

  if (isError) {
    return <NotFound />
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-3">
      <div className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-lg bg-gray-100 px-5 py-12 text-center lg:px-12 lg:py-16">
        <img src={logoIcon} alt="brev.ly" className="size-12" />

        <h1 className="text-xl">Redirecionando...</h1>

        <div className="flex flex-col gap-1 text-md text-gray-500">
          <p>O link será aberto automaticamente em alguns instantes.</p>
          <p>
            Não foi redirecionado?{' '}
            {link ? (
              <a href={link.originalUrl} className="text-blue-base underline">
                Acesse aqui
              </a>
            ) : (
              <span className="text-blue-base">Acesse aqui</span>
            )}
          </p>
        </div>
      </div>
    </main>
  )
}