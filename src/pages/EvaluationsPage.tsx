import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'
import { ExpertEvaluationsList } from '@/features/evaluations/components/ExpertEvaluationsList'
import { useAuthStore } from '@/store/authStore'

export function EvaluationsPage() {
  const user = useAuthStore((s) => s.user)
  const isExpert = user?.role === 'expert'

  return (
    <PageLayout>
      <Header variant="auth" />
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        {isExpert ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-text-primary mb-6">
              Evaluaciones para revisar
            </h1>
            <ExpertEvaluationsList />
          </>
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="text-text-secondary">Mis evaluaciones — próximamente</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
