import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'

export function EvaluationsPage() {
  return (
    <PageLayout>
      <Header variant="auth" />
      {/* Evaluation dashboard will go here */}
      <div className="flex items-center justify-center py-24">
        <p className="text-text-secondary">Mis evaluaciones — próximamente</p>
      </div>
    </PageLayout>
  )
}
