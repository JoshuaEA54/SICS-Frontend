import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { EvaluationBadge } from "@/components/ui/Badge";
import { useExpertEvaluationDetail } from '@/features/evaluations/hooks/useExpertEvaluationDetail'

export function ExpertEvaluationPage() {
  const { evaluation, loading, error, displayTitle, goToInbox } =
    useExpertEvaluationDetail()

  return (
    <PageLayout>
      <Header />
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        {loading && (
          <div className="flex justify-center py-16">
            <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-text-secondary">{error}</p>
            <Button variant="secondary" className="mt-4" onClick={goToInbox}>
              Volver a la bandeja
            </Button>
          </div>
        )}

        {!loading && !error && evaluation && (
          <div className="rounded-xl border border-border bg-surface p-8">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-semibold text-text-primary">
                {displayTitle}
              </h1>
              <EvaluationBadge status={evaluation.status} />
            </div>

            <p className="text-text-secondary">
              Revisión control por control — disponible próximamente (Fase 3).
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Aquí podrá ver las respuestas de la empresa, emitir veredictos y
              marcar la evaluación como revisada.
            </p>

            <div className="mt-8">
              <Button variant="secondary" onClick={goToInbox}>
                Volver a la bandeja
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
