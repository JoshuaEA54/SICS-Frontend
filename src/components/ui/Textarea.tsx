import { type TextareaHTMLAttributes, useId } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  helperText?: string
  error?: string
}

export function Textarea({
  label,
  required,
  helperText,
  error,
  className = '',
  id: idProp,
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[12px] font-medium text-text-dim">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
          {!required && (
            <span className="ml-1 font-light text-text-muted">(opcional)</span>
          )}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full resize-none rounded-[7px] border bg-surface-bg px-[13.4px] py-[9.4px] text-[13.2px] font-light text-text-primary placeholder:text-text-primary/50 transition-colors focus:border-primary focus:bg-white focus:outline-none ${error ? 'border-red-400' : 'border-border'} ${className}`}
        rows={props.rows ?? 3}
        {...props}
      />
      {helperText && !error && (
        <p className="text-[11.5px] text-text-muted">{helperText}</p>
      )}
      {error && <p className="text-[11.5px] text-red-500">{error}</p>}
    </div>
  )
}
