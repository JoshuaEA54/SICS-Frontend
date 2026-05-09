import { type Evidence } from '@/types/evaluation'
import { PaperclipIcon, FileIcon, TrashIcon } from '@/components/ui/Icons'
import { useEvidenceUpload, EVIDENCE_ACCEPT } from '../hooks/useEvidenceUpload'

interface EvidenceUploadProps {
  evidence: Evidence[]
  onUpload: (files: File[]) => Promise<void>
  onDelete: (evidenceId: string) => Promise<void>
}

export function EvidenceUpload({ evidence, onUpload, onDelete }: EvidenceUploadProps) {
  const {
    fileInputRef,
    dragging,
    uploading,
    deletingId,
    handleFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDelete,
  } = useEvidenceUpload({ evidence, onUpload, onDelete })

  return (
    <div className="mb-4 flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#44445a]">
        Evidencia de cumplimiento
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-1 rounded-[8px] border-2 border-dashed py-6 transition-colors ${
          dragging
            ? 'border-primary bg-[#eff4ff]'
            : 'border-border bg-surface-alt hover:border-primary/40 hover:bg-[#f5f7ff]'
        }`}
      >
        <span className={dragging ? 'text-primary' : 'text-text-muted'}>
          <PaperclipIcon />
        </span>
        <span className="text-[13.5px] font-medium text-text-primary">
          {uploading ? 'Subiendo…' : 'Adjuntar evidencia'}
        </span>
        <span className="text-[12px] text-text-muted">
          Política, procedimiento, captura de pantalla, etc.
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={EVIDENCE_ACCEPT}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {evidence.length > 0 && (
        <ul className="mt-1 flex flex-col gap-1">
          {evidence.map((ev) => (
            <li key={ev.id} className="flex items-center gap-2 rounded-[6px] bg-surface-alt px-3 py-2">
              <span className="text-text-muted"><FileIcon /></span>
              <span className="flex-1 text-[12.5px] text-text-secondary">{ev.file_name}</span>
              <button
                onClick={() => handleDelete(ev.id)}
                disabled={deletingId === ev.id}
                className="text-text-muted transition-colors hover:text-red-500 disabled:opacity-40"
                title="Eliminar evidencia"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
