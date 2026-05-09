import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  helperText?: string
  error?: string
  leftElement?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    required,
    helperText,
    error,
    leftElement,
    className = '',
    id: idProp,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[12.8px] font-medium text-text-primary">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </label>
      )}
      <div className="relative">
        {leftElement && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {leftElement}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-[7px] border bg-surface-bg px-[13.4px] py-[9.4px] text-sm font-light text-text-primary placeholder:text-text-muted/50 transition-colors focus:border-primary focus:bg-white focus:outline-none ${error ? 'border-red-400' : 'border-border'} ${leftElement ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
      {helperText && !error && (
        <p className="text-[11.5px] text-text-muted">{helperText}</p>
      )}
      {error && <p className="text-[11.5px] text-red-500">{error}</p>}
    </div>
  )
})
