import { Combobox } from '@/components/ui/Combobox'
import { useCompanySearchOptions } from '@/features/company/hooks/useCompanySearchOptions'
import { useCombobox } from '@/hooks/useCombobox'
import { useDebounce } from '@/hooks/useDebounce'
import { COMPANY_NAME_MAX_LENGTH } from '@/lib/constants'

interface CompanyComboboxProps {
  value: string
  onChange: (companyId: string) => void
  disabled?: boolean
}

export function CompanyCombobox({ value, onChange, disabled }: CompanyComboboxProps) {
  const combobox = useCombobox({ disabled })
  const debouncedQuery = useDebounce(combobox.filterQuery)
  const { options, loading, selectedLabel } = useCompanySearchOptions({
    value,
    enabled: combobox.open,
    query: debouncedQuery,
  })

  return (
    <Combobox
      value={value}
      displayLabel={selectedLabel}
      placeholder="Empresa"
      options={options}
      loading={loading}
      disabled={disabled}
      open={combobox.open}
      filterQuery={combobox.filterQuery}
      onToggle={combobox.toggleDropdown}
      onClose={combobox.closeDropdown}
      onFilterQueryChange={combobox.setFilterQuery}
      onSelect={(id) => onChange(id)}
      clearOption={{ value: '', label: 'Todas las empresas' }}
      searchPlaceholder="Buscar empresa…"
      searchMaxLength={COMPANY_NAME_MAX_LENGTH}
      className="min-w-[180px] flex-1 sm:max-w-xs"
      containerRef={combobox.containerRef}
      searchInputRef={combobox.searchInputRef}
      listboxId={combobox.listboxId}
    />
  )
}
