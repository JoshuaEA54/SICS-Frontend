/** Pure utilities for compliance percentage display (colors and labels). */

export type ComplianceBand = 'red' | 'amber' | 'lightGreen' | 'darkGreen'

export function getComplianceBand(percentage: number): ComplianceBand {
  if (percentage < 50) return 'red'
  if (percentage < 70) return 'amber'
  if (percentage < 90) return 'lightGreen'
  return 'darkGreen'
}

export interface BandStyle {
  textClass: string
  bgClass: string
  borderClass: string
  label: string
  strokeColor: string
  trackColor: string
}

const BAND_STYLES: Record<ComplianceBand, BandStyle> = {
  red: {
    textClass: 'text-red-700',
    bgClass: 'bg-red-100',
    borderClass: 'border-red-300',
    label: 'Nivel crítico',
    strokeColor: '#b91c1c',
    trackColor: '#fee2e2',
  },
  amber: {
    textClass: 'text-amber-700',
    bgClass: 'bg-amber-100',
    borderClass: 'border-amber-300',
    label: 'Nivel deficiente',
    strokeColor: '#b45309',
    trackColor: '#fef3c7',
  },
  lightGreen: {
    textClass: 'text-green-700',
    bgClass: 'bg-green-100',
    borderClass: 'border-green-300',
    label: 'Nivel aceptable',
    strokeColor: '#15803d',
    trackColor: '#dcfce7',
  },
  darkGreen: {
    textClass: 'text-emerald-800',
    bgClass: 'bg-emerald-100',
    borderClass: 'border-emerald-400',
    label: 'Nivel óptimo',
    strokeColor: '#065f46',
    trackColor: '#d1fae5',
  },
}

export function getComplianceStyles(band: ComplianceBand): BandStyle {
  return BAND_STYLES[band]
}

/** Sanitize a company name into a safe filename segment. */
export function buildReportDownloadFilename(
  companyName: string,
  reviewedAt: string | null | undefined,
): string {
  const dateStr = reviewedAt
    ? new Date(reviewedAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10)

  let sanitized = companyName
    .trim()
    .replace(/[^\w\s-]/gu, '')
    .replace(/[\s/_]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (sanitized.length > 50) {
    sanitized = sanitized.slice(0, 50).replace(/-+$/, '')
  }

  return `${sanitized}-informe-sics-${dateStr}.pdf`
}
