import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { type ControlGroup } from "@/types/controls";
import { toastError } from "@/store/toastStore";
import { evaluationsApi } from "@/lib/api/evaluations";
import { type ResponseState } from "./useQuestionnaire";


export function useGroupNavigation(
  evaluationId: string,
  groupsRef: React.MutableRefObject<ControlGroup[]>,
  responsesMapRef: React.MutableRefObject<Record<string, ResponseState>>,
  groups: ControlGroup[],
  responsesMap: Record<string, ResponseState>,
  initialGroupIndex: number,
) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const currentGroupIndexRef = useRef(0);

  useEffect(() => {
    if (initialGroupIndex > 0) {
      currentGroupIndexRef.current = initialGroupIndex;
      setCurrentGroupIndex(initialGroupIndex);
    }
  }, [initialGroupIndex]);

  const isInitialized = useRef(false)

  const activeGroupIndex = useMemo(() => {
    const idx = groups.findIndex((g) =>
      g.controls.some((c) => {
        const r = responsesMap[c.id];
        return r === undefined || r.complies === null;
      }),
    );
    return idx === -1 ? groups.length - 1 : idx;
  }, [groups, responsesMap]);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }
    const activeGroup = groups[activeGroupIndex];
    if (activeGroup) {
      evaluationsApi.updateLastGroup(evaluationId, activeGroup.id).catch(() => {});
    }
  }, [activeGroupIndex]);

  const goToGroup = useCallback((index: number) => {
    if (index === currentGroupIndexRef.current) return;
    currentGroupIndexRef.current = index;
    setCurrentGroupIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goNext = useCallback(() => {
    const group = groupsRef.current[currentGroupIndexRef.current];
    const unanswered =
      group?.controls.filter((c) => {
        const r = responsesMapRef.current[c.id];
        return r === undefined || r.complies === null;
      }).length ?? 0;
    if (unanswered > 0) {
      toastError(
        `Faltan ${unanswered} control${unanswered === 1 ? "" : "es"} por responder en este grupo.`,
      );
      return;
    }
    setCurrentGroupIndex((i) => {
      const next = Math.min(i + 1, groupsRef.current.length - 1);
      currentGroupIndexRef.current = next;
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [groupsRef, responsesMapRef]);

  const goPrev = useCallback(() => {
    setCurrentGroupIndex((i) => {
      const prev = Math.max(i - 1, 0);
      currentGroupIndexRef.current = prev;
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    const group = groupsRef.current[currentGroupIndexRef.current];
    const unanswered =
      group?.controls.filter((c) => {
        const r = responsesMapRef.current[c.id];
        return r === undefined || r.complies === null;
      }).length ?? 0;
    if (unanswered > 0) {
      toastError(
        `Faltan ${unanswered} control${unanswered === 1 ? "" : "es"} por responder en este grupo.`,
      );
      return false;
    }
    try {
      await evaluationsApi.submitEvaluation(evaluationId);
      return true;
    } catch {
      toastError("No se pudo enviar la evaluación. Intenta de nuevo.");
      return false;
    }
  }, [evaluationId, groupsRef, responsesMapRef]);

  return { currentGroupIndex, activeGroupIndex, goToGroup, goNext, goPrev, handleSubmit };
}
