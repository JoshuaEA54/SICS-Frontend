import { useNavigate } from "react-router-dom";
import { evaluationsApi } from "@/lib/api/evaluations";
import { type User } from "@/types/auth";

export function usePostLoginRedirect() {
  const navigate = useNavigate();

  return async (user: User | null) => {
    if (user?.role === "expert") return navigate("/evaluaciones");
    if (!user?.company_id) return navigate("/registro");
    if (!user?.job_title) return navigate("/registro/paso-2");
    const draft = await evaluationsApi.getDraftEvaluation();
    navigate(draft ? `/cuestionario/${draft.id}` : "/evaluaciones");
  };
}
