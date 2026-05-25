import { canPreviewEvidence } from '@/lib/evidence'
import { docxPreviewStrategy } from './docxPreview'
import { downloadOnlyPreviewStrategy } from './downloadOnly'
import { nativePreviewStrategy } from './nativePreview'
import {
  type PreviewRenderResult,
  type PreviewStrategy,
  revokePreviewUrls,
} from './types'
import { xlsxPreviewStrategy } from './xlsxPreview'

const PREVIEW_STRATEGIES: PreviewStrategy[] = [
  nativePreviewStrategy,
  docxPreviewStrategy,
  xlsxPreviewStrategy,
  downloadOnlyPreviewStrategy,
]

export function resolvePreviewStrategy(mime: string, fileName: string): PreviewStrategy {
  const normalizedMime = (mime ?? '').toLowerCase()
  return (
    PREVIEW_STRATEGIES.find((s) => s.id !== 'download-only' && s.match(normalizedMime, fileName)) ??
    downloadOnlyPreviewStrategy
  )
}

export async function renderEvidencePreview(
  blob: Blob,
  mime: string | null,
  fileName: string,
): Promise<{ result: PreviewRenderResult; objectUrls: string[] }> {
  const normalizedMime = (mime ?? blob.type ?? '').toLowerCase()
  const ctx = { objectUrls: [] as string[] }

  if (!canPreviewEvidence(mime, fileName)) {
    const result = await downloadOnlyPreviewStrategy.render(blob, fileName, ctx)
    return { result, objectUrls: ctx.objectUrls }
  }

  const strategy = resolvePreviewStrategy(normalizedMime, fileName)
  const result = await strategy.render(blob, fileName, ctx)
  return { result, objectUrls: ctx.objectUrls }
}

export { revokePreviewUrls }
export { DocxPreviewFrame } from './DocxPreviewFrame'
export type { PreviewRenderResult } from './types'
