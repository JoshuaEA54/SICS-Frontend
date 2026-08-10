import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanyEvaluations } from "../hooks/useCompanyEvaluations";
import { SubmittedCard } from "./SubmittedCard";
import { ReviewedCard } from "./ReviewedCard";
import { DraftCard } from "./DraftCard";
import { ReportPreviewModal } from "./ReportPreviewModal";
import { useReportPreview } from "../hooks/useReportPreview";
import { Button } from "@/components/ui/Button";
import { PlusCircleIcon } from "@/components/ui/Icons";
import { evaluationsApi } from "@/lib/api/evaluations";
import { useAuthStore } from "@/store/authStore";
import { toastError, toastInfo } from "@/store/toastStore";
import { type EvaluationSummary } from "@/types/evaluation";

function evalNumber(
  evaluation: EvaluationSummary,
  allSorted: EvaluationSummary[],
): number {
  return allSorted.findIndex((e) => e.id === evaluation.id) + 1;
}

export function CompanyEvaluationsDashboard() {
  const navigate = useNavigate();
  const companyId = useAuthStore((s) => s.user?.company_id);
  const [creating, setCreating] = useState(false);
  const { submitted, reviewed, draft, hasSubmitted, hasDraft, loading, error } =
    useCompanyEvaluations();
  const {
    reportOpen,
    reportLoading,
    reportBlobUrl,
    activeReportEvaluation,
    openReport,
    closeReport,
    downloadReport,
  } = useReportPreview();

  const allSorted = [...submitted, ...reviewed].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const total = allSorted.length + (draft ? 1 : 0);

  const handleNewEvaluation = async () => {
    if (hasSubmitted) {
      toastInfo(
        "Podrá hacer una nueva evaluación cuando el experto complete la revisión actual.",
      );
      return;
    }

    if (hasDraft) {
      toastInfo(
        "Ya tienes una evaluación en curso. Continúala desde el panel.",
      );
      return;
    }

    if (!companyId) {
      toastError("No se encontró la empresa asociada a su cuenta.");
      return;
    }

    setCreating(true);
    try {
      const evaluation = await evaluationsApi.createEvaluation(companyId);
      navigate(`/cuestionario/${evaluation.id}`);
    } catch {
      toastError("No se pudo crear la evaluación. Intente de nuevo.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-text-secondary">{error}</p>
      </div>
    );
  }

  const reportTitle = activeReportEvaluation
    ? `Informe - ${activeReportEvaluation.company_name ?? "Evaluación"}`
    : "Informe de cumplimiento";

  const canCreateNew = !hasSubmitted && !hasDraft;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-semibold text-text-primary">
            Mis evaluaciones
          </h1>
          {total > 0 && (
            <p className="mt-1 text-[13px] text-text-secondary">
              {total} evaluación{total !== 1 ? "es" : ""} registrada
              {total !== 1 ? "s" : ""}.
            </p>
          )}
        </div>

        <Button
          variant="primary"
          leftIcon={<PlusCircleIcon />}
          loading={creating}
          disabled={!canCreateNew}
          onClick={handleNewEvaluation}
        >
          Nueva evaluación
        </Button>
      </div>

      {total === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-[13px] text-text-muted">
            Aún no hay evaluaciones registradas.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {draft && <DraftCard evaluation={draft} />}

        {submitted.map((e) => (
          <SubmittedCard
            key={e.id}
            evaluation={e}
            num={evalNumber(e, allSorted)}
          />
        ))}

        {reviewed.length > 0 && (
          <div className="flex flex-col gap-4">
            {reviewed.map((e) => (
              <ReviewedCard
                key={e.id}
                evaluation={e}
                num={evalNumber(e, allSorted)}
                onViewReport={() => openReport(e)}
              />
            ))}
          </div>
        )}
      </div>

      <ReportPreviewModal
        open={reportOpen}
        loading={reportLoading}
        blobUrl={reportBlobUrl}
        title={reportTitle}
        onClose={closeReport}
        onDownload={downloadReport}
      />
    </div>
  );
}
