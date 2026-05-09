import type { ReactNode } from 'react'

interface ToggleOption {
  value: string
  label: string
  icon?: ReactNode
}

interface ToggleGroupProps {
  label?: string
  required?: boolean
  options: ToggleOption[]
  value: string
  onChange: (value: string) => void
  error?: string
}

export function ToggleGroup({ label, required, options, value, onChange, error }: ToggleGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-[12.8px] font-medium text-text-primary">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </span>
      )}
      <div className="flex gap-2">
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-1.5 rounded-[7px] border px-4 py-2 text-[13.6px] transition-colors ${
                selected
                  ? 'border-primary bg-[#eff4ff] font-medium text-primary'
                  : 'border-border bg-surface-bg font-normal text-text-secondary'
              }`}
            >
              {opt.icon && <span className="size-[13px]">{opt.icon}</span>}
              {opt.label}
            </button>
          )
        })}
      </div>
      {error && <p className="text-[11.5px] text-red-500">{error}</p>}
    </div>
  )
}
