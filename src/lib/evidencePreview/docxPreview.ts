import mammoth from 'mammoth'
import { type PreviewStrategy } from './types'

export const docxPreviewStrategy: PreviewStrategy = {
  id: 'docx',
  match: (mime, fileName) =>
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.toLowerCase().endsWith('.docx'),
  async render(blob, _fileName, _ctx) {
    const arrayBuffer = await blob.arrayBuffer()
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer })
    return { kind: 'html', content: html }
  },
}
