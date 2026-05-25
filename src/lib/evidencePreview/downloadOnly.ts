import { type PreviewStrategy } from './types'

export const downloadOnlyPreviewStrategy: PreviewStrategy = {
  id: 'download-only',
  match: () => true,
  async render(_blob, fileName, _ctx) {
    return {
      kind: 'download-only',
      message: `Vista previa no disponible para "${fileName}". Descargue el archivo para revisarlo.`,
    }
  },
}
