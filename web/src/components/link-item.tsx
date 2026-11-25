import { Check, CircleNotch, Copy, Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { env, shortLinkDomain } from '../env'
import { deleteLink, type Link } from '../http/links'
import { IconButton } from './ui/icon-button'

type LinkItemProps = {
  link: Link
}

export function LinkItem({ link }: LinkItemProps) {
  const queryClient = useQueryClient()
  const [isCopied, setIsCopied] = useState(false)

  const shortLink = `${env.VITE_FRONTEND_URL}/${link.shortUrl}`

  const { mutate: deleteLinkFn, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteLink(link.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
    onError: () => {
      alert('Não foi possível deletar o link. Tente novamente.')
    },
  })

  async function handleCopy() {
    await navigator.clipboard.writeText(shortLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  function handleDelete() {
    const confirmed = confirm(`Você realmente quer apagar o link ${link.shortUrl}?`)

    if (confirmed) {
      deleteLinkFn()
    }
  }

  return (
    <li className="flex items-center gap-4 border-t border-gray-200 pt-3 lg:gap-5 lg:pt-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <a
          href={shortLink}
          target="_blank"
          rel="noreferrer"
          className="truncate text-md text-blue-base hover:underline"
        >
          {shortLinkDomain}/{link.shortUrl}
        </a>
        <span className="truncate text-sm text-gray-500">
        {link.originalUrl.replace(/^https?:\/\//, '')}
        </span>
      </div>

      <span className="whitespace-nowrap text-sm text-gray-500">
        {link.accessCount} {link.accessCount === 1 ? 'acesso' : 'acessos'}
      </span>

      <div className="flex gap-1">
        <IconButton
          aria-label={isCopied ? 'Link copiado' : 'Copiar link'}
          onClick={handleCopy}
        >
          {isCopied ? <Check size={16} className="text-blue-base" /> : <Copy size={16} />}
        </IconButton>

        <IconButton aria-label="Deletar link" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? <CircleNotch size={16} className="animate-spin" /> : <Trash size={16} />}
        </IconButton>
      </div>
    </li>
  )
}