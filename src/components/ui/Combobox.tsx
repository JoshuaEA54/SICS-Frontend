import { type RefObject } from 'react'

import { ChevronDownIcon } from '@/components/ui/Icons'

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  value: string
  displayLabel: string | null
  placeholder: string
  options: ComboboxOption[]
  open: boolean
  filterQuery: string
  onToggle: () => void
  onClose: () => void
  onFilterQueryChange: (query: string) => void
  onSelect: (value: string, label: string) => void
  disabled?: boolean
  loading?: boolean
  clearOption?: ComboboxOption | null
  searchPlaceholder?: string
  searchMaxLength?: number
  emptyMessage?: string
  loadingMessage?: string
  className?: string
  containerRef?: RefObject<HTMLDivElement>
  searchInputRef?: RefObject<HTMLInputElement>
  listboxId?: string
}

export function Combobox({
  value,
  displayLabel,
  placeholder,
  options,
  open,
  filterQuery,
  onToggle,
  onClose,
  onFilterQueryChange,
  onSelect,
  disabled,
  loading,
  clearOption,
  searchPlaceholder = 'Buscar…',
  searchMaxLength,
  emptyMessage = 'Sin coincidencias',
  loadingMessage = 'Buscando…',
  className = '',
  containerRef,
  searchInputRef,
  listboxId,
}: ComboboxProps) {
  function handleSelect(optionValue: string, optionLabel: string) {
    onSelect(optionValue, optionLabel)
    onClose()
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 rounded-[7px] border border-border bg-surface-bg px-[13.4px] py-[9.4px] text-left text-sm font-light transition-colors hover:border-primary/30 focus:border-primary focus:bg-white focus:outline-none disabled:opacity-50"
      >
        <span className={displayLabel ? 'truncate text-text-primary' : 'truncate text-text-muted/50'}>
          {displayLabel ?? placeholder}
        </span>
        <ChevronDownIcon
          className={`shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-[7px] border border-border bg-surface shadow-md">
          <div className="border-b border-border p-2">
            <input
              ref={searchInputRef}
              type="search"
              placeholder={searchPlaceholder}
              value={filterQuery}
              maxLength={searchMaxLength}
              onChange={(e) => {
                const next =
                  searchMaxLength != null
                    ? e.target.value.slice(0, searchMaxLength)
                    : e.target.value
                onFilterQueryChange(next)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose()
              }}
              className="w-full rounded-[7px] border border-border bg-surface-bg px-3 py-2 text-sm font-light text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
          <ul id={listboxId} role="listbox" className="max-h-48 overflow-auto py-1">
            {clearOption && (
              <li role="option" aria-selected={value === clearOption.value}>
                <button
                  type="button"
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-surface-alt ${
                    value === clearOption.value
                      ? 'bg-primary/5 font-medium text-primary'
                      : 'text-text-secondary'
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(clearOption.value, clearOption.label)}
                >
                  {clearOption.label}
                </button>
              </li>
            )}
            {loading ? (
              <li className="px-3 py-2 text-sm text-text-muted">{loadingMessage}</li>
            ) : options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-text-muted">{emptyMessage}</li>
            ) : (
              options.map((option) => (
                <li key={option.value} role="option" aria-selected={value === option.value}>
                  <button
                    type="button"
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-surface-alt ${
                      value === option.value
                        ? 'bg-primary/5 font-medium text-primary'
                        : 'text-text-primary'
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(option.value, option.label)}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
