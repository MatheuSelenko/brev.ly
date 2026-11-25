import { CircleNotch } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { shortLinkDomain } from '../env'
import { ApiError } from '../http/api'
import { createLink } from '../http/links'
import { Button } from './ui/button'
import { Input } from './ui/input'

function withProtocol(value: string) {
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

function isValidUrl(value: string) {
  try {
    const url = new URL(withProtocol(value))
    const hasValidProtocol = url.protocol === 'http:' || url.protocol === 'https:'
    const hasDomain = /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(url.hostname)

    return hasValidProtocol && hasDomain
  } catch {
    return false
  }
}

const newLinkSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, 'Informe a url original.')
    .refine(isValidUrl, 'Informe uma url válida.'),
  shortUrl: z
    .string()
    .trim()
    .min(3, 'A url encurtada precisa ter pelo menos 3 caracteres.')
    .max(50, 'A url encurtada pode ter no máximo 50 caracteres.')
    .regex(/^[a-z0-9-]+$/, 'Informe uma url minúscula e sem espaço/caracter especial.'),
})

type NewLinkFormData = z.infer<typeof newLinkSchema>

export function NewLinkForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<NewLinkFormData>({
    resolver: zodResolver(newLinkSchema),
    mode: 'onTouched',
  })

  const { mutateAsync: createLinkFn, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  async function handleCreateLink(data: NewLinkFormData) {
    try {
      await createLinkFn({
        originalUrl: withProtocol(data.originalUrl),
        shortUrl: data.shortUrl,
      })
      reset()
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError('shortUrl', { message: 'Essa url encurtada já existe.' })
        return
      }

      setError('root', { message: 'Não foi possível salvar o link. Tente novamente.' })
    }
  }

  const [originalUrl, shortUrl] = watch(['originalUrl', 'shortUrl'])
  const isFormEmpty = !originalUrl || !shortUrl

  return (
    <div className="flex w-full shrink-0 flex-col gap-5 rounded-lg bg-gray-100 p-6 lg:w-[380px] lg:gap-6 lg:p-8">
      <h2 className="text-lg">Novo link</h2>

      <form onSubmit={handleSubmit(handleCreateLink)} className="flex flex-col gap-4">
        <Input
          id="originalUrl"
          label="Link original"
          placeholder="www.exemplo.com.br"
          error={errors.originalUrl?.message}
          {...register('originalUrl')}
        />
        <Input
          id="shortUrl"
          label="Link encurtado"
          prefix={`${shortLinkDomain}/`}
          error={errors.shortUrl?.message}
          {...register('shortUrl')}
        />

        {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}

        <Button type="submit" disabled={isFormEmpty || isPending}>
          {isPending && <CircleNotch size={16} className="animate-spin" />}
          {isPending ? 'Salvando...' : 'Salvar link'}
        </Button>
      </form>
    </div>
  )
}