import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'
import { useAuthStore } from '@/store/authStore'

export function RegisterPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <PageLayout>
      <Header
        variant="auth"
        userName={user?.name ?? ''}
        userEmail={user?.email ?? ''}
      />
      {/* Registration forms will go here */}
      <div className="flex items-center justify-center py-24">
        <p className="text-text-secondary">Formulario de registro — próximamente</p>
      </div>
    </PageLayout>
  )
}
