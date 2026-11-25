import type { ComponentProps } from 'react'
import { tv } from 'tailwind-variants'

const iconButtonVariants = tv({
  base: 'flex size-8 cursor-pointer items-center justify-center rounded border border-transparent bg-gray-200 text-gray-600 transition-colors enabled:hover:border-blue-base disabled:cursor-not-allowed disabled:opacity-50',
})

type IconButtonProps = ComponentProps<'button'>

export function IconButton({ className, type = 'button', ...props }: IconButtonProps) {
  return <button type={type} className={iconButtonVariants({ className })} {...props} />
}