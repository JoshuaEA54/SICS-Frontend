import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'

interface HeaderPublicProps {
  variant: 'public'
  onStartEvaluation?: () => void
}

interface HeaderAuthProps {
  variant: 'auth'
  userName: string
  userEmail: string
}

type HeaderProps = HeaderPublicProps | HeaderAuthProps

function LogoSection() {
  return (
    <Link to="/" className="flex h-full items-center gap-3">
      <div className="flex items-center gap-2">
        <img src="/favicon.svg" alt="SICS logo" className="h-7 w-7 sm:h-8 sm:w-8" />
        <span className="text-[22px] font-bold tracking-[-0.512px] text-text-primary sm:text-[25.6px]">
          SICS
        </span>
      </div>
      <span className="hidden h-7 w-px bg-border sm:block" aria-hidden />
      <span className="hidden text-[11.5px] font-light leading-tight text-text-secondary sm:block">
        Sistema Integrado de Cumplimiento en
        <br />
        Seguridad
      </span>
    </Link>
  )
}

export function Header(props: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-[64.8px] border-b border-border bg-white">
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-4 sm:px-8">
        <LogoSection />

        {props.variant === 'public' && (
          <Button
            variant="primary"
            size="sm"
            onClick={props.onStartEvaluation}
          >
            Iniciar evaluación
          </Button>
        )}

        {props.variant === 'auth' && (
          <div className="flex items-center gap-3">
            <Avatar name={props.userName} size="sm" />
            <span className="text-[12.8px] text-text-dim">{props.userEmail}</span>
          </div>
        )}
      </div>
    </header>
  )
}
