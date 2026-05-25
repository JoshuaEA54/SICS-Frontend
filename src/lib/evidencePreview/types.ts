export type PreviewRenderResult =
  | { kind: 'iframe'; src: string }
  | { kind: 'image'; src: string }
  | { kind: 'text'; content: string }
  | { kind: 'html'; content: string }
  | { kind: 'docx'; blob: Blob }
  | { kind: 'download-only'; message: string }

export interface PreviewStrategy {
  id: string
  match: (mime: string, fileName: string) => boolean
  render: (
    blob: Blob,
    fileName: string,
    ctx: PreviewStrategyContext,
  ) => Promise<PreviewRenderResult>
}

export interface PreviewStrategyContext {
  objectUrls: string[]
}

export function trackObjectUrl(ctx: PreviewStrategyContext, url: string): string {
  ctx.objectUrls.push(url)
  return url
}

export function revokePreviewUrls(urls: string[]) {
  for (const url of urls) {
    URL.revokeObjectURL(url)
  }
}
