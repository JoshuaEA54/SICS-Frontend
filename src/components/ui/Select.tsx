import { type SelectHTMLAttributes, forwardRef, useId } from 'react'

import { ChevronDownIcon } from '@/components/ui/Icons'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  options: SelectOption[]
  placeholder?: string
  error?: string | boolean
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
    value,
    defaultValue,
    onChange,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  const isEmpty = typeof value !== 'string' || value.trim().length === 0

  const showRequiredHint = Boolean(required) && isEmpty
  const invalid = Boolean(error) || showRequiredHint

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="flex items-baseline gap-1.5">
          <span className="text-[12.8px] font-medium text-text-primary">{label}</span>
          {showRequiredHint && (
            <span className="text-[10px] font-semibold text-red-500">REQUERIDO *</span>
          )}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          className={`w-full appearance-none rounded-[7px] border bg-surface-bg px-[13.4px] py-[9.4px] pr-8 text-sm font-light text-text-primary transition-colors focus:bg-white focus:outline-none ${invalid ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-primary'} ${className}`}
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
          <ChevronDownIcon />
        </span>
      </div>
      {helperText && !invalid && (
        <p className="text-[11.5px] text-text-muted">{helperText}</p>
      )}
      {typeof error === 'string' && error && <p className="text-[11.5px] text-red-500">{error}</p>}
    </div>
  )
})
