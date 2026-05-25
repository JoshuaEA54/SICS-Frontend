import { useRef, useCallback, useState } from 'react'
import { canPreviewEvidence, downloadBlob } from '@/lib/evidence'
import { evaluationsApi } from '@/lib/api/evaluations'
import {
  type PreviewRenderResult,
  renderEvidencePreview,
  revokePreviewUrls,
} from '@/lib/evidencePreview'
import { type Evidence } from '@/types/evaluation'
import { toastError, toastInfo } from '@/store/toastStore'

export function useEvidencePreview() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeEvidence, setActiveEvidence] = useState<Evidence | null>(null)
  const [previewResult, setPreviewResult] = useState<PreviewRenderResult | null>(null)
  const objectUrlsRef = useRef<string[]>([])
  const [cachedBlob, setCachedBlob] = useState<Blob | null>(null)

  const clearUrls = useCallback(() => {
    revokePreviewUrls(objectUrlsRef.current)
    objectUrlsRef.current = []
  }, [])

  const closePreview = useCallback(() => {
    clearUrls()
    setOpen(false)
    setActiveEvidence(null)
    setPreviewResult(null)
    setCachedBlob(null)
    setLoading(false)
  }, [clearUrls])

  const downloadActive = useCallback(async () => {
    if (!activeEvidence) return
    try {
      const blob = cachedBlob ?? (await evaluationsApi.fetchEvidenceFile(activeEvidence.id))
      downloadBlob(blob, activeEvidence.file_name)
    } catch {
      toastError('No se pudo descargar el archivo.')
    }
  }, [activeEvidence, cachedBlob])

  const openPreview = useCallback(
    async (evidence: Evidence) => {
      const mime = evidence.file_type ?? ''
      if (!canPreviewEvidence(mime, evidence.file_name)) {
        toastInfo('Vista previa no disponible. Descargando archivo…')
        try {
          const blob = await evaluationsApi.fetchEvidenceFile(evidence.id)
          downloadBlob(blob, evidence.file_name)
        } catch {
          toastError('No se pudo descargar el archivo.')
        }
        return
      }

      clearUrls()
      setActiveEvidence(evidence)
      setOpen(true)
      setLoading(true)
      setPreviewResult(null)

      try {
        const blob = await evaluationsApi.fetchEvidenceFile(evidence.id)
        setCachedBlob(blob)
        const { result, objectUrls } = await renderEvidencePreview(
          blob,
          evidence.file_type,
          evidence.file_name,
        )
        if (result.kind === 'download-only') {
          closePreview()
          toastInfo(result.message)
          downloadBlob(blob, evidence.file_name)
          return
        }
        objectUrlsRef.current = objectUrls
        setPreviewResult(result)
      } catch {
        toastError('No se pudo cargar la vista previa.')
        closePreview()
      } finally {
        setLoading(false)
      }
    },
    [clearUrls, closePreview],
  )

  const downloadEvidence = useCallback(async (evidence: Evidence) => {
    try {
      const blob = await evaluationsApi.fetchEvidenceFile(evidence.id)
      downloadBlob(blob, evidence.file_name)
    } catch {
      toastError('No se pudo descargar el archivo.')
    }
  }, [])

  return {
    previewOpen: open,
    previewLoading: loading,
    previewEvidence: activeEvidence,
    previewResult,
    openPreview,
    closePreview,
    downloadPreview: downloadActive,
    downloadEvidence,
  }
}
