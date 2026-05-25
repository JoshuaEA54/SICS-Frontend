import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { evaluationsApi } from "@/lib/api/evaluations";
import { canFinalizeEvaluation } from "@/features/evaluations/expertReview";
import { type ControlGroup } from "@/types/controls";
import { type Evaluation, type Response } from "@/types/evaluation";
import { toastError, toastSuccess } from "@/store/toastStore";

interface UseExpertFinalizeParams {
  evaluation: Evaluation | null;
  setEvaluation: React.Dispatch<React.SetStateAction<Evaluation | null>>;
  isEditable: boolean;
  groups: ControlGroup[];
  activeGroupIndex: number;
  responses: Response[];
}

export function useExpertFinalize({
  evaluation,
  setEvaluation,
  isEditable,
  groups,
  activeGroupIndex,
  responses,
}: UseExpertFinalizeParams) {
  const navigate = useNavigate();
  const [finalizing, setFinalizing] = useState(false);
  const [finalizeConfirmOpen, setFinalizeConfirmOpen] = useState(false);

  const canFinalize = useMemo(
    () => canFinalizeEvaluation(evaluation, responses),
    [evaluation, responses],
  );

  const goToInbox = useCallback(() => navigate("/evaluaciones"), [navigate]);

  const requestFinalize = useCallback(() => {
    if (!evaluation || !isEditable || finalizing) return;
    if (!canFinalize) {
      const activeGroup = groups[activeGroupIndex];
      toastError(
        activeGroup
          ? `Primero complete el grupo ${activeGroup.id} · ${activeGroup.name}.`
          : "Faltan veredictos por emitir antes de cerrar la revisión.",
      );
      return;
    }
    setFinalizeConfirmOpen(true);
  }, [
    evaluation,
    isEditable,
    finalizing,
    canFinalize,
    groups,
    activeGroupIndex,
  ]);

  const cancelFinalize = useCallback(() => {
    if (!finalizing) setFinalizeConfirmOpen(false);
  }, [finalizing]);

  const handleFinalize = useCallback(async () => {
    if (!evaluation || !canFinalize || finalizing) return;
    setFinalizing(true);
    try {
      const updated = await evaluationsApi.finalizeReview(evaluation.id);
      setEvaluation(updated);
      setFinalizeConfirmOpen(false);
      toastSuccess("Evaluación marcada como revisada.");
      navigate("/evaluaciones");
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      toastError(detail ?? "No se pudo cerrar la revisión.");
    } finally {
      setFinalizing(false);
    }
  }, [evaluation, canFinalize, finalizing, navigate, setEvaluation]);

  return {
    canFinalize,
    finalizing,
    finalizeConfirmOpen,
    requestFinalize,
    cancelFinalize,
    handleFinalize,
    goToInbox,
  };
}
