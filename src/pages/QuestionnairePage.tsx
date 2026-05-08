import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'

export function QuestionnairePage() {
  return (
    <PageLayout>
      <Header variant="auth" />
      {/* Questionnaire will go here */}
      <div className="flex items-center justify-center py-24">
        <p className="text-text-secondary">Cuestionario — próximamente</p>
      </div>
    </PageLayout>
  )
}
