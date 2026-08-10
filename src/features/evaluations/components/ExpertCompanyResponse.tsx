import { CheckSmIcon, XIcon } from "@/components/ui/Icons";

interface ExpertCompanyResponseProps {
  complies: boolean | null;
  observations: string | null;
}

export function ExpertCompanyResponse({
  complies,
  observations,
}: ExpertCompanyResponseProps) {
  return (
    <div className="mb-4 rounded-[8px] border border-border bg-surface-alt p-4">
      <p className="mb-2 text-[12px] font-medium text-text-primary">
        Respuesta de la empresa
      </p>
      <div
        className={`mb-3 inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-[14px] font-medium ${
          complies
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-red-300 bg-red-50 text-red-600"
        }`}
      >
        {complies ? <CheckSmIcon /> : <XIcon />}
        {complies ? "Sí, cumple" : "No cumple"}
      </div>

      {observations ? (
        <div>
          <p className="mb-1 text-[12px] font-medium text-[#44445a]">
            Observaciones
          </p>
          <p className="whitespace-pre-wrap break-words text-[13.2px] font-light text-text-secondary">
            {observations}
          </p>
        </div>
      ) : (
        <p className="text-[12.5px] text-text-muted">Sin observaciones.</p>
      )}
    </div>
  );
}
