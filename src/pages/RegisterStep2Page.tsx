import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { PageLayout } from '@/components/layout/PageLayout'
import { StepHeader } from '@/components/layout/StepHeader'
import { RegisterStep2Form } from '@/features/company/components/RegisterStep2Form'

export function RegisterStep2Page() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <PageLayout>
      <Header variant="auth" />
      <StepHeader current="registro" />
      <div className="mx-auto max-w-[580px] px-4 py-8">
        <RegisterStep2Form />
      </div>
    </PageLayout>
  )
}
