import { useLayoutEffect, useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EvidencePreviewModal } from "@/components/ui/EvidencePreviewModal";
import { Button } from "@/components/ui/Button";
import { ExpertControlCard } from "@/features/evaluations/components/ExpertControlCard";
import { ExpertReviewFooter } from "@/features/evaluations/components/ExpertReviewFooter";
import { ExpertReviewHeader } from "@/features/evaluations/components/ExpertReviewHeader";
import { useExpertReview } from "@/features/evaluations/hooks/useExpertReview";
import { GroupHeader } from "@/components/shared/GroupHeader";
import { GroupSidebar } from "@/components/shared/GroupSidebar";

export function ExpertEvaluationPage() {
  const [sidebarTop, setSidebarTop] = useState(0);

  const {
    groups,
    evaluation,
    loading,
    error,
    reload,
    isReadOnly,
    isEditable,
    currentGroup,
    currentGroupIndex,
    isLastGroup,
    isFirstGroup,
    goToGroup,
    goNext,
    goPrev,
    responsesByControlId,
    reviewProgress,
    groupProgress,
    isGroupCompleted,
    handleVerdictChange,
    requestFinalize,
    handleFinalize,
    finalizeConfirmOpen,
    cancelFinalize,
    finalizing,
    getEvidenceForControl,
    loadingEvidence,
    displayTitle,
    goToInbox,
    previewOpen,
    previewLoading,
    previewEvidence,
    previewResult,
    openPreview,
    closePreview,
    downloadPreview,
    downloadEvidence,
  } = useExpertReview();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // El sidebar se pega justo bajo el Header principal.
  // Medimos el <header> directamente del DOM para no envolverlo ni hardcodear valores.
  useLayoutEffect(() => {
    const headerEl = document.querySelector("header");
    if (!headerEl) return;

    const update = () => setSidebarTop(headerEl.getBoundingClientRect().height);
    update();
    const obs = new ResizeObserver(update);
    obs.observe(headerEl);
    window.addEventListener("resize", update);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <PageLayout>
      <Header />

      {loading && (
        <div className="flex items-center justify-center py-24">
          <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-text-secondary">{error}</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={reload}>
              Reintentar
            </Button>
            <Button variant="ghost" onClick={goToInbox}>
              Volver a la bandeja
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && evaluation && currentGroup && (
        <>
          <ExpertReviewHeader
            displayTitle={displayTitle}
            evaluation={evaluation}
            reviewProgress={reviewProgress}
            onBack={goToInbox}
          />

          <div className="flex min-h-screen items-start px-[120px]">
            <GroupSidebar
              groups={groups}
              currentIndex={currentGroupIndex}
              onSelectGroup={goToGroup}
              isGroupCompleted={isGroupCompleted}
              stickyTop={sidebarTop}
            />

            <main className="flex flex-1 flex-col gap-4 py-8 pl-8 pr-0">
              <GroupHeader
                group={currentGroup}
                completedCount={groupProgress.completed}
                totalCount={groupProgress.required}
                progressSuffix={
                  isReadOnly ? "controles con veredicto" : "veredictos emitidos"
                }
              />

              {loadingEvidence && (
                <p className="text-sm text-text-muted">Cargando evidencias…</p>
              )}

              {currentGroup.controls.map((control) => (
                <ExpertControlCard
                  key={control.id}
                  control={control}
                  response={responsesByControlId[control.id]}
                  evidence={getEvidenceForControl(control.id)}
                  readOnly={isReadOnly}
                  onVerdictChange={handleVerdictChange}
                  onPreviewEvidence={openPreview}
                  onDownloadEvidence={downloadEvidence}
                />
              ))}

              <ExpertReviewFooter
                isFirstGroup={isFirstGroup}
                isLastGroup={isLastGroup}
                isEditable={isEditable}
                finalizing={finalizing}
                onPrev={goPrev}
                onNext={goNext}
                onFinalize={requestFinalize}
              />
            </main>
          </div>

          <ConfirmDialog
            open={finalizeConfirmOpen}
            title="Marcar como revisada"
            description="Una vez confirmada, la evaluación quedará cerrada y no podrá modificar los veredictos emitidos. ¿Desea continuar?"
            confirmLabel="Sí, marcar como revisada"
            loading={finalizing}
            onConfirm={handleFinalize}
            onCancel={cancelFinalize}
          />

          <EvidencePreviewModal
            open={previewOpen}
            loading={previewLoading}
            fileName={previewEvidence?.file_name ?? null}
            result={previewResult}
            onClose={closePreview}
            onDownload={downloadPreview}
          />
        </>
      )}
    </PageLayout>
  );
}
