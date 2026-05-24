import { Button } from '@/components/ui/Button'
import { DEFAULT_PAGE } from '@/lib/constants'

interface PaginationProps {
  page: number
  pages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, pages, onPageChange, className = '' }: PaginationProps) {
  if (pages <= 1) return null

  return (
    <nav
      aria-label="Paginación"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= DEFAULT_PAGE}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>
      <span className="text-sm text-text-secondary">
        Página {page} de {pages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </Button>
    </nav>
  )
}
