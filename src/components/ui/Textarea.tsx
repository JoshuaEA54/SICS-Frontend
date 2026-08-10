import { type TextareaHTMLAttributes, forwardRef, useId } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  helperText?: string
  error?: string | boolean
  showCharCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    required,
    helperText,
    error,
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
            <span className="text-[12px] font-medium text-text-dim">{label}</span>
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
      <textarea
        ref={ref}
        id={id}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={onChange}
        className={`w-full resize-none rounded-[7px] border bg-surface-bg px-[13.4px] py-[9.4px] text-[13.2px] font-light text-text-primary placeholder:text-text-primary/50 transition-colors focus:bg-white focus:outline-none ${invalid ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-primary'} ${className}`}
        rows={props.rows ?? 3}
        {...props}
      />
      {helperText && !invalid && (
        <p className="text-[11.5px] text-text-muted">{helperText}</p>
      )}
      {typeof error === 'string' && error && <p className="text-[11.5px] text-red-500">{error}</p>}
    </div>
  )
})
