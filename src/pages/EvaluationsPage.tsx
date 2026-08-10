import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";
import { ExpertDashboard } from "@/features/evaluations/components/ExpertDashboard";
import { CompanyEvaluationsDashboard } from "@/features/evaluations/components/CompanyEvaluationsDashboard";
import { useAuthStore } from "@/store/authStore";

export function EvaluationsPage() {
  const user = useAuthStore((s) => s.user);
  const isExpert = user?.role === "expert";

  return (
    <PageLayout>
      <Header />
      {isExpert ? (
        <ExpertDashboard />
      ) : (
        <CompanyEvaluationsDashboard />
      )}
    </PageLayout>
  );
}
