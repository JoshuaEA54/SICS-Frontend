import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  helperText?: string
  error?: string | boolean
  leftElement?: ReactNode
  showCharCount?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    required,
    helperText,
    error,
    leftElement,
    showCharCount,
    className = '',
    id: idProp,
    value,
    defaultValue,
    onChange,
    maxLength,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  const currentValue = typeof value === 'string' ? value : ''
  const isEmpty = currentValue.trim().length === 0

  const showRequiredHint = Boolean(required) && isEmpty
  const invalid = Boolean(error) || showRequiredHint

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-baseline justify-between">
          <label htmlFor={id} className="flex items-baseline gap-1.5">
            <span className="text-[12.8px] font-medium text-text-primary">{label}</span>
            {showRequiredHint && (
              <span className="text-[10px] font-semibold text-red-500">REQUERIDO *</span>
            )}
          </label>
          {showCharCount && maxLength !== undefined && (
            <span
              className={`text-[11px] tabular-nums ${
                currentValue.length >= maxLength ? 'text-red-500' : 'text-text-muted'
              }`}
            >
              {currentValue.length} / {maxLength}
            </span>
          )}
        </div>
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
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={onChange}
          className={`w-full rounded-[7px] border bg-surface-bg px-[13.4px] py-[9.4px] text-sm font-light text-text-primary placeholder:text-text-muted/50 transition-colors focus:bg-white focus:outline-none ${invalid ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-primary'} ${leftElement ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
      {helperText && !invalid && (
        <p className="text-[11.5px] text-text-muted">{helperText}</p>
      )}
      {typeof error === 'string' && error && <p className="text-[11.5px] text-red-500">{error}</p>}
    </div>
  )
})
