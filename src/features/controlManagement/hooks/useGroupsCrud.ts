import { useCallback, useEffect, useState } from 'react'
import { controlsApi } from '@/lib/api/controls'
import { apiErrorMessage } from '@/lib/apiError'
import { useDebounce } from '@/hooks/useDebounce'
import { toastError, toastSuccess } from '@/store/toastStore'
import { DEFAULT_PAGE, API_MAX_PAGE_SIZE } from '@/lib/constants'
import {
  type ControlGroupCreate,
  type ControlGroupRead,
  type ControlGroupUpdate,
} from '@/types/controls'

export function useGroupsCrud() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput)
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [groups, setGroups] = useState<ControlGroupRead[]>([])
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Ids de todos los grupos (sin filtro de búsqueda), solo para sugerir el próximo código.
  const [allIds, setAllIds] = useState<string[]>([])

  useEffect(() => {
    setPage(DEFAULT_PAGE)
  }, [debouncedSearch])

  const fetchGroups = useCallback(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const q = debouncedSearch.trim()
    controlsApi
      .listGroups({ q: q || undefined, page, size: API_MAX_PAGE_SIZE })
      .then((data) => {
        if (cancelled) return
        setGroups(data.items)
        setPages(data.pages)
        setTotal(data.total)
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar los grupos de controles.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedSearch, page])

  useEffect(() => fetchGroups(), [fetchGroups])

  const fetchAllIds = useCallback(() => {
    controlsApi
      .listGroups({ size: API_MAX_PAGE_SIZE })
      .then((data) => setAllIds(data.items.map((g) => g.id)))
      .catch(() => {})
  }, [])

  useEffect(() => fetchAllIds(), [fetchAllIds])

  const createGroup = useCallback(
    async (data: ControlGroupCreate) => {
      try {
        await controlsApi.createGroup(data)
        toastSuccess('Grupo creado correctamente.')
        fetchGroups()
        fetchAllIds()
        return true
      } catch (err) {
        toastError(apiErrorMessage(err, 'No se pudo crear el grupo.'))
        return false
      }
    },
    [fetchGroups, fetchAllIds],
  )

  const updateGroup = useCallback(
    async (id: string, data: ControlGroupUpdate) => {
      try {
        await controlsApi.updateGroup(id, data)
        toastSuccess('Grupo actualizado correctamente.')
        fetchGroups()
        return true
      } catch (err) {
        toastError(apiErrorMessage(err, 'No se pudo actualizar el grupo.'))
        return false
      }
    },
    [fetchGroups],
  )

  const deleteGroup = useCallback(
    async (id: string) => {
      try {
        await controlsApi.deleteGroup(id)
        toastSuccess('Grupo eliminado correctamente.')
        fetchGroups()
        fetchAllIds()
        return true
      } catch (err) {
        toastError(apiErrorMessage(err, 'No se pudo eliminar el grupo.'))
        return false
      }
    },
    [fetchGroups, fetchAllIds],
  )

  return {
    groups,
    total,
    page,
    pages,
    loading,
    error,
    searchInput,
    setSearchInput,
    setPage,
    allIds,
    createGroup,
    updateGroup,
    deleteGroup,
  }
}
