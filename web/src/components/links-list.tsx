import {
  CircleNotch,
  DownloadSimple,
  Link as LinkIcon,
  Warning,
} from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { exportLinks, listLinks } from '../http/links'
import { LinkItem } from './link-item'
import { Button } from './ui/button'

export function LinksList() {
  const { data: links, isLoading, isFetching, isError } = useQuery({
    queryKey: ['links'],
    queryFn: listLinks,
  })

  const { mutate: exportLinksFn, isPending: isExporting } = useMutation({
    mutationFn: exportLinks,
    onSuccess: ({ reportUrl }) => {
      const anchor = document.createElement('a')
      anchor.href = reportUrl
      anchor.download = ''
      anchor.click()
    },
    onError: () => {
      alert('Não foi possível gerar o CSV. Tente novamente.')
    },
  })

  const isEmpty = !isLoading && !isError && links?.length === 0

  return (
    <div className="relative flex min-h-0 w-full flex-col gap-4 overflow-hidden rounded-lg bg-gray-100 p-6 lg:max-h-[calc(100dvh-176px)] lg:flex-1 lg:gap-5 lg:p-8">
      {isFetching && (
        <div className="absolute top-0 left-0 h-1 w-1/3 animate-loading-bar bg-blue-base" />
      )}

      <div className="flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-lg">Meus links</h2>

        <Button
          variant="secondary"
          onClick={() => exportLinksFn()}
          disabled={isLoading || isError || isEmpty || isExporting}
        >
          {isExporting ? (
            <CircleNotch size={16} className="animate-spin text-gray-600" />
          ) : (
            <DownloadSimple size={16} className="text-gray-600" />
          )}
          Baixar CSV
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-3 border-t border-gray-200 pt-4 pb-6">
          <CircleNotch size={32} className="animate-spin text-gray-400" />
          <span className="text-xs uppercase text-gray-500">Carregando links...</span>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 border-t border-gray-200 pt-4 pb-6">
          <Warning size={32} className="text-danger" />
          <span className="text-center text-xs uppercase text-gray-500">
            Não foi possível carregar os links
          </span>
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center gap-3 border-t border-gray-200 pt-4 pb-6">
          <LinkIcon size={32} className="text-gray-400" />
          <span className="text-center text-xs uppercase text-gray-500">
            Ainda não existem links cadastrados
          </span>
        </div>
      )}

      {links && links.length > 0 && (
        <ul className="scrollbar-thin flex min-h-0 flex-col gap-3 overflow-y-auto pr-1 lg:gap-4 lg:pr-2">
          {links.map((link) => (
            <LinkItem key={link.id} link={link} />
          ))}
        </ul>
      )}
    </div>
  )
}