import { useCallback, useEffect, useId, useRef, useState } from 'react'

interface UseComboboxOptions {
  disabled?: boolean
}

export function useCombobox({ disabled }: UseComboboxOptions = {}) {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [filterQuery, setFilterQuery] = useState('')

  const closeDropdown = useCallback(() => {
    setOpen(false)
    setFilterQuery('')
  }, [])

  const openDropdown = useCallback(() => {
    if (disabled) return
    setOpen(true)
    setFilterQuery('')
    requestAnimationFrame(() => searchInputRef.current?.focus())
  }, [disabled])

  const toggleDropdown = useCallback(() => {
    if (open) closeDropdown()
    else openDropdown()
  }, [open, closeDropdown, openDropdown])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeDropdown])

  return {
    open,
    filterQuery,
    setFilterQuery,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    containerRef,
    searchInputRef,
    listboxId,
  }
}
