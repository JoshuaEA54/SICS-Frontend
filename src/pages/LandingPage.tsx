import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <PageLayout>
      <Header variant="public" onStartEvaluation={() => navigate('/registro')} />
      <main className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-3 text-[11.5px] font-medium uppercase tracking-[1.382px] text-primary">
          Evaluación de Cumplimiento
        </p>
        <h1 className="font-display max-w-2xl text-[64px] font-light leading-[1.15] tracking-[-1.6px] text-text-primary">
          Evalúe la madurez de su seguridad{' '}
          <em className="font-bold not-italic">en el marco regulatorio costarricense.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[17px] font-light text-text-secondary">
          SICS evalúa el nivel de cumplimiento de sus controles de seguridad de la información
          con base en <strong className="font-medium text-text-primary">ISO 27001, ISO 27002, ISO 27005, ISO 27701, NIST CSF</strong> y la{' '}
          <strong className="font-medium text-text-primary">Ley 8968</strong>.
        </p>
        <Button
          className="mt-10"
          size="lg"
          onClick={() => navigate('/registro')}
        >
          Comenzar evaluación
        </Button>
      </main>
    </PageLayout>
  )
}
