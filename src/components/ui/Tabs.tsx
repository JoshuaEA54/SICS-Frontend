import { type ReactNode } from 'react'

interface TabItem {
  value: string
  label: string
  icon?: ReactNode
}

interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  variant: 'underline' | 'rail'
  className?: string
}

export function Tabs({ items, value, onChange, variant, className = '' }: TabsProps) {
  const tabClass =
    variant === 'underline'
      ? (active: boolean) =>
          `border-b-[3px] pb-3.5 text-[15px] font-semibold ${
            active ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`
      : (active: boolean) =>
          `border-b-2 pb-3 text-[13.5px] ${
            active
              ? 'border-primary font-semibold text-primary'
              : 'border-transparent font-medium text-text-secondary hover:text-text-primary'
          }`

  const iconOpacity = variant === 'underline' ? 'opacity-50' : 'opacity-55'
  const iconWeight = variant === 'underline' ? '[&>svg]:stroke-[2.6]' : ''

  return (
    <div role="tablist" className={`flex gap-6 border-b border-border ${className}`}>
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={`-mb-px flex items-center gap-2 transition-colors ${tabClass(active)}`}
          >
            {item.icon && (
              <span className={`${active ? 'opacity-100' : iconOpacity} ${iconWeight}`}>{item.icon}</span>
            )}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
