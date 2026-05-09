import { useRef, useState } from 'react'
import { type Evidence } from '@/types/evaluation'
import { toastError } from '@/store/toastStore'

export const MAX_SIZE_MB = 25
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
export const MAX_FILES_PER_CONTROL = 10

export const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/webp',
])

export const EVIDENCE_ACCEPT = [...ALLOWED_MIME_TYPES].join(',')

interface UseEvidenceUploadOptions {
  evidence: Evidence[]
  onUpload: (files: File[]) => Promise<void>
  onDelete: (evidenceId: string) => Promise<void>
}

export function useEvidenceUpload({ evidence, onUpload, onDelete }: UseEvidenceUploadOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function clearInput() {
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const list = Array.from(files)

    if (evidence.length + list.length > MAX_FILES_PER_CONTROL) {
      toastError(
        `Solo se permiten hasta ${MAX_FILES_PER_CONTROL} archivos por control. Actualmente hay ${evidence.length}.`,
      )
      clearInput()
      return
    }

    const existingNames = new Set(evidence.map((ev) => ev.file_name))
    const duplicate = list.find((f) => existingNames.has(f.name))
    if (duplicate) {
      toastError(`El archivo "${duplicate.name}" ya fue adjuntado.`)
      clearInput()
      return
    }

    const invalidType = list.find((f) => !ALLOWED_MIME_TYPES.has(f.type))
    if (invalidType) {
      toastError(
        `Tipo de archivo no permitido: "${invalidType.name}". Formatos aceptados: PDF, Word, Excel, PowerPoint, imágenes y texto.`,
      )
      clearInput()
      return
    }

    const tooBig = list.find((f) => f.size > MAX_SIZE_BYTES)
    if (tooBig) {
      toastError(`"${tooBig.name}" supera el límite de ${MAX_SIZE_MB} MB.`)
      clearInput()
      return
    }

    setUploading(true)
    try {
      await onUpload(list)
    } finally {
      setUploading(false)
      clearInput()
    }
  }

  async function handleDelete(evidenceId: string) {
    setDeletingId(evidenceId)
    try {
      await onDelete(evidenceId)
    } finally {
      setDeletingId(null)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return {
    fileInputRef,
    dragging,
    uploading,
    deletingId,
    handleFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDelete,
  }
}
