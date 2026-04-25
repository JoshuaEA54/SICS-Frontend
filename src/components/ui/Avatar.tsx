type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  name: string
  size?: AvatarSize
  className?: string
}

const sizes: Record<AvatarSize, string> = {
  sm: 'size-[30px] text-[12px]',
  md: 'size-[40px] text-[16px]',
  lg: 'size-[48px] text-[18px]',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-primary font-bold text-white ${sizes[size]} ${className}`}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  )
}
