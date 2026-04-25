import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'
import { useAuthStore } from '@/store/authStore'

export function QuestionnairePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <PageLayout>
      <Header
        variant="auth"
        userName={user?.name ?? ''}
        userEmail={user?.email ?? ''}
      />
      {/* Questionnaire will go here */}
      <div className="flex items-center justify-center py-24">
        <p className="text-text-secondary">Cuestionario — próximamente</p>
      </div>
    </PageLayout>
  )
}
