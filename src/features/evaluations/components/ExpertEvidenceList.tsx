import { type Evidence } from '@/types/evaluation'
import { canPreviewEvidence } from '@/lib/evidence'
import { FileIcon } from '@/components/ui/Icons'

interface ExpertEvidenceListProps {
  evidence: Evidence[]
  onPreview: (evidence: Evidence) => void
  onDownload: (evidence: Evidence) => void
}

export function ExpertEvidenceList({ evidence, onPreview, onDownload }: ExpertEvidenceListProps) {
  if (evidence.length === 0) {
    return (
      <p className="text-[12.5px] font-light text-text-muted">Sin evidencias adjuntas.</p>
    )
  }

  return (
    <ul className="flex flex-col gap-1">
      {evidence.map((ev) => {
        const previewable = canPreviewEvidence(ev.file_type, ev.file_name)
        return (
          <li
            key={ev.id}
            className="flex items-center gap-2 rounded-[6px] bg-surface-alt px-3 py-2"
          >
            <span className="text-text-muted">
              <FileIcon />
            </span>
            <span className="flex-1 truncate text-[12.5px] text-text-secondary">{ev.file_name}</span>
            {previewable && (
              <button
                type="button"
                onClick={() => onPreview(ev)}
                className="shrink-0 text-[12px] font-medium text-primary hover:underline"
              >
                Ver
              </button>
            )}
            <button
              type="button"
              onClick={() => onDownload(ev)}
              className={`shrink-0 text-[12px] font-medium hover:underline ${
                previewable
                  ? 'text-text-secondary hover:text-primary'
                  : 'text-primary'
              }`}
            >
              Descargar
            </button>
          </li>
        )
      })}
    </ul>
  )
}
