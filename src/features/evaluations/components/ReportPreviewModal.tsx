import { XIcon } from '@/components/ui/Icons'
import { Button } from '@/components/ui/Button'

interface ReportPreviewModalProps {
  open: boolean
  loading: boolean
  blobUrl: string | null
  title: string
  onClose: () => void
  onDownload: () => void
}

export function ReportPreviewModal({
  open,
  loading,
  blobUrl,
  title,
  onClose,
  onDownload,
}: ReportPreviewModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="truncate text-sm font-medium text-text-primary">{title}</p>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onDownload} disabled={loading}>
              Descargar
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-alt hover:text-text-primary"
              aria-label="Cerrar"
            >
              <XIcon />
            </button>
          </div>
        </div>

        <div className="min-h-[320px] flex-1 overflow-auto bg-surface-bg p-4">
          {loading && (
            <div className="flex h-64 items-center justify-center">
              <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!loading && blobUrl && (
            <iframe
              title={title}
              src={`${blobUrl}#toolbar=0&navpanes=0`}
              className="h-[70vh] w-full rounded-md border border-border bg-white"
            />
          )}
        </div>
      </div>
    </div>
  )
}
