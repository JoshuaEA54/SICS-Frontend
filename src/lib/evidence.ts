/** Constantes compartidas de evidencias (upload empresa + revisión experto). */

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

export type EvidencePreviewTier = 'native' | 'converted' | 'download-only'

const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const NATIVE_TEXT_MIMES = new Set(['text/plain', 'text/csv'])

export function getEvidencePreviewTier(mime: string | null, fileName: string): EvidencePreviewTier {
  const m = (mime ?? '').toLowerCase()
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''

  if (m === 'application/pdf' || IMAGE_MIMES.has(m) || NATIVE_TEXT_MIMES.has(m)) {
    return 'native'
  }
  if (
    m === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    return 'converted'
  }
  if (
    m === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    ext === 'xlsx'
  ) {
    return 'converted'
  }
  return 'download-only'
}

export function canPreviewEvidence(mime: string | null, fileName: string): boolean {
  return getEvidencePreviewTier(mime, fileName) !== 'download-only'
}

/** Dispara descarga de un Blob en el navegador (utilidad DOM, no API). */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}
