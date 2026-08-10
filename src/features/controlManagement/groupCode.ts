const DEFAULT_PREFIX = 'G'
const ID_PATTERN = /^([A-Za-z]+)(\d+)$/

/** Sugiere el siguiente código de grupo (ej. "G16" existente -> "G17"), basado en el prefijo más usado entre los ids actuales. */
export function suggestNextGroupId(existingIds: string[]): string {
  const matches = existingIds
    .map((id) => ID_PATTERN.exec(id))
    .filter((m): m is RegExpExecArray => m !== null)

  if (matches.length === 0) return `${DEFAULT_PREFIX}01`

  const prefixCounts = new Map<string, number>()
  for (const m of matches) {
    prefixCounts.set(m[1], (prefixCounts.get(m[1]) ?? 0) + 1)
  }
  const [prefix] = [...prefixCounts.entries()].sort((a, b) => b[1] - a[1])[0]

  const relevant = matches.filter((m) => m[1] === prefix)
  const numbers = relevant.map((m) => Number(m[2]))
  const width = Math.max(...relevant.map((m) => m[2].length))
  const next = Math.max(...numbers) + 1

  return `${prefix}${String(next).padStart(width, '0')}`
}
