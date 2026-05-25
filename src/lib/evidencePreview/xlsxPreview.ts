import * as XLSX from 'xlsx'
import { type PreviewStrategy } from './types'

const MAX_PREVIEW_ROWS = 100

export const xlsxPreviewStrategy: PreviewStrategy = {
  id: 'xlsx',
  match: (mime, fileName) =>
    mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    fileName.toLowerCase().endsWith('.xlsx'),
  async render(blob, _fileName, _ctx) {
    const arrayBuffer = await blob.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) {
      return { kind: 'html', content: '<p>Hoja de cálculo vacía.</p>' }
    }
    const sheet = workbook.Sheets[firstSheetName]
    const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
      header: 1,
      defval: '',
    }) as (string | number | boolean | null)[][]

    const limited = rows.slice(0, MAX_PREVIEW_ROWS)
    const tableRows = limited
      .map(
        (row) =>
          `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell ?? ''))}</td>`).join('')}</tr>`,
      )
      .join('')

    const truncatedNote =
      rows.length > MAX_PREVIEW_ROWS
        ? `<p class="text-sm text-gray-500">Mostrando ${MAX_PREVIEW_ROWS} de ${rows.length} filas.</p>`
        : ''

    return {
      kind: 'html',
      content: `${truncatedNote}<div class="overflow-x-auto"><table class="w-full border-collapse text-sm"><tbody>${tableRows}</tbody></table></div>`,
    }
  },
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
