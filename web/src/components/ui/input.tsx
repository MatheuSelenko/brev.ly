import type { ComponentProps } from 'react'
import { Warning } from '@phosphor-icons/react'
import { tv } from 'tailwind-variants'

const inputVariants = tv({
  slots: {
    container: 'group flex flex-col gap-2',
    label:
      'text-xs uppercase text-gray-500 transition-colors group-focus-within:font-bold group-focus-within:text-blue-base',
    field:
      'flex h-12 w-full items-center rounded-lg border border-gray-300 px-4 transition-colors focus-within:border-blue-base focus-within:ring-[0.5px] focus-within:ring-blue-base',
    prefix: 'select-none text-md font-normal text-gray-400',
    input:
      'h-full min-w-0 flex-1 bg-transparent text-md font-normal text-gray-600 outline-none placeholder:text-gray-400',
    message: 'flex items-center gap-2 text-sm text-gray-500',
  },
  variants: {
    hasError: {
      true: {
        label: 'font-bold text-danger group-focus-within:text-danger',
        field:
          'border-danger ring-[0.5px] ring-danger focus-within:border-danger focus-within:ring-danger',
      },
    },
  },
})

type InputProps = ComponentProps<'input'> & {
  label: string
  error?: string
  prefix?: string
}

export function Input({ label, error, prefix, id, className, ...props }: InputProps) {
  const styles = inputVariants({ hasError: !!error })

  return (
    <div className={styles.container()}>
      <label htmlFor={id} className={styles.label()}>
        {label}
      </label>

      <div className={styles.field()}>
        {prefix && <span className={styles.prefix()}>{prefix}</span>}

        <input
          id={id}
          aria-invalid={!!error}
          className={styles.input({ className })}
          {...props}
        />
      </div>

      {error && (
        <span className={styles.message()}>
          <Warning size={16} className="text-danger" />
          {error}
        </span>
      )}
    </div>
  )
}