import { type SelectHTMLAttributes, forwardRef, useId } from 'react'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  options: SelectOption[]
  placeholder?: string
  error?: string
  helperText?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    required,
    options,
    placeholder,
    error,
    helperText,
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
        <select
          ref={ref}
          id={id}
          className={`w-full appearance-none rounded-[7px] border bg-surface-bg px-[13.4px] py-[9.4px] pr-8 text-sm font-light text-text-primary transition-colors focus:border-primary focus:bg-white focus:outline-none ${error ? 'border-red-400' : 'border-border'} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* chevron icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {helperText && !error && (
        <p className="text-[11.5px] text-text-muted">{helperText}</p>
      )}
      {error && <p className="text-[11.5px] text-red-500">{error}</p>}
    </div>
  )
})
