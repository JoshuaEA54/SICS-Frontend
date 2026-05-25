import {
  type PreviewStrategy,
  type PreviewStrategyContext,
  trackObjectUrl,
} from './types'

const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const TEXT_MIMES = new Set(['text/plain', 'text/csv'])

export const nativePreviewStrategy: PreviewStrategy = {
  id: 'native',
  match: (mime) =>
    mime === 'application/pdf' || IMAGE_MIMES.has(mime) || TEXT_MIMES.has(mime),
  async render(blob, _fileName, ctx: PreviewStrategyContext) {
    if (blob.type === 'application/pdf') {
      const src = trackObjectUrl(ctx, URL.createObjectURL(blob))
      return { kind: 'iframe', src }
    }

    if (IMAGE_MIMES.has(blob.type)) {
      const src = trackObjectUrl(ctx, URL.createObjectURL(blob))
      return { kind: 'image', src }
    }

    if (TEXT_MIMES.has(blob.type)) {
      const content = await blob.text()
      return { kind: 'text', content }
    }

    return {
      kind: 'download-only',
      message: 'Vista previa no disponible para este formato.',
    }
  },
}
