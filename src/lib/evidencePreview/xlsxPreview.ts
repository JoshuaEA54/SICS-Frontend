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
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })
    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) {
      return { kind: 'html', content: '<p>Hoja de cálculo vacía.</p>' }
    }
    const sheet = workbook.Sheets[firstSheetName]
    const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
      header: 1,
      defval: '',
      raw: false,
    }) as (string | number | boolean | null | Date)[][]

    const limited = rows.slice(0, MAX_PREVIEW_ROWS)
    const [headerRow, ...bodyRows] = limited

    const headerHtml =
      headerRow && headerRow.length > 0
        ? `<thead><tr>${headerRow.map((cell) => `<th>${escapeHtml(formatCell(cell))}</th>`).join('')}</tr></thead>`
        : ''

    const bodyHtml = bodyRows
      .map(
        (row) =>
          `<tr>${row.map((cell) => `<td>${escapeHtml(formatCell(cell))}</td>`).join('')}</tr>`,
      )
      .join('')

    const truncatedNote =
      rows.length > MAX_PREVIEW_ROWS
        ? `<p class="preview-truncated-note">Mostrando ${MAX_PREVIEW_ROWS} de ${rows.length} filas.</p>`
        : ''

    return {
      kind: 'html',
      content: `<div class="evidence-preview-html">${truncatedNote}<div style="overflow-x:auto"><table>${headerHtml}<tbody>${bodyHtml}</tbody></table></div></div>`,
    }
  },
}

function formatCell(value: string | number | boolean | null | Date): string {
  if (value == null || value === '') return ''
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return (value as Date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return String(value)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
