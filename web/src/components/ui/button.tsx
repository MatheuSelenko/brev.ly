import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'flex items-center justify-center cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      primary:
        'h-12 gap-3 rounded-lg bg-blue-base px-5 text-md text-white enabled:hover:bg-blue-dark',
      secondary:
        'h-8 gap-1.5 rounded border border-transparent bg-gray-200 px-2 text-sm font-semibold text-gray-500 enabled:hover:border-blue-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={buttonVariants({ variant, className })} {...props} />
}