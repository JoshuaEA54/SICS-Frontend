import { getComplianceBand, getComplianceStyles } from '@/features/evaluations/complianceDisplay'

interface ComplianceScoreProps {
  percentage: number
  size?: 'sm' | 'md'
}

const SIZE_CONFIG = {
  sm: { diameter: 48, strokeWidth: 5, fontSize: 'text-[13px]' },
  md: { diameter: 80, strokeWidth: 8, fontSize: 'text-[17.6px]' },
} as const

export function ComplianceScore({ percentage, size = 'md' }: ComplianceScoreProps) {
  const band = getComplianceBand(percentage)
  const styles = getComplianceStyles(band)
  const { diameter, strokeWidth, fontSize } = SIZE_CONFIG[size]

  const center = diameter / 2
  const radius = center - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const filled = Math.min(Math.max(percentage, 0), 100) / 100 * circumference
  const displayPct = `${Math.round(percentage)}%`

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: diameter, height: diameter }}
      role="img"
      aria-label={`Cumplimiento ${displayPct}, ${styles.label}`}
    >
      <svg
        width={diameter}
        height={diameter}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={styles.trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={styles.strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`absolute font-display font-bold tabular-nums leading-none text-text-primary ${fontSize}`}
      >
        {displayPct}
      </span>
    </div>
  )
}
