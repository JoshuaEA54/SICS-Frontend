import { useEffect, useState } from 'react'
import { type ComboboxOption } from '@/components/ui/Combobox'
import { companiesApi } from '@/lib/api/companies'
import { API_MAX_PAGE_SIZE } from '@/lib/constants'

interface UseCompanySearchOptionsParams {
  value: string
  enabled: boolean
  query: string
}

export function useCompanySearchOptions({ value, enabled, query }: UseCompanySearchOptionsParams) {
  const [options, setOptions] = useState<ComboboxOption[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      setSelectedLabel(null)
      return
    }

    let cancelled = false
    companiesApi
      .getCompany(value)
      .then((company) => {
        if (!cancelled) setSelectedLabel(company.name)
      })
      .catch(() => {
        if (!cancelled) setSelectedLabel(null)
      })

    return () => {
      cancelled = true
    }
  }, [value])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    setLoading(true)

    const q = query.trim()
    companiesApi
      .listCompanies(q ? { q, size: API_MAX_PAGE_SIZE } : { size: API_MAX_PAGE_SIZE })
      .then((items) => {
        if (!cancelled) {
          setOptions(items.map((item) => ({ value: item.id, label: item.name })))
        }
      })
      .catch(() => {
        if (!cancelled) setOptions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, query])

  return { options, loading, selectedLabel }
}
