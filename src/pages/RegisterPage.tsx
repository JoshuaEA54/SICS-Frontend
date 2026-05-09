import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'
import { StepHeader } from '@/components/layout/StepHeader'
import { RegisterStep1Form } from '@/features/company/components/RegisterStep1Form'

export function RegisterPage() {
  return (
    <PageLayout>
      <Header />
      <StepHeader current="registro" />
      <div className="mx-auto max-w-[580px] px-4 py-8">
        <RegisterStep1Form />
      </div>
    </PageLayout>
  )
}
