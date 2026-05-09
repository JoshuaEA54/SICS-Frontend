import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";
import { ExpertEvaluationsList } from "@/features/evaluations/components/ExpertEvaluationsList";
import { CompanyEvaluationsDashboard } from "@/features/evaluations/components/CompanyEvaluationsDashboard";
import { useAuthStore } from "@/store/authStore";

export function EvaluationsPage() {
  const user = useAuthStore((s) => s.user);
  const isExpert = user?.role === "expert";

  return (
    <PageLayout>
      <Header />
      {isExpert ? (
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <h1 className="font-display text-2xl font-semibold text-text-primary mb-6">
            Evaluaciones para revisar
          </h1>
          <ExpertEvaluationsList />
        </div>
      ) : (
        <CompanyEvaluationsDashboard />
      )}
    </PageLayout>
  );
}
