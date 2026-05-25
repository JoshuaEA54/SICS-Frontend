import { ControlCardMeta } from '@/components/shared/ControlCardMeta'
import { ExpertCompanyResponse } from '@/features/evaluations/components/ExpertCompanyResponse'
import { ExpertEvidenceList } from '@/features/evaluations/components/ExpertEvidenceList'
import { ExpertVerdictField } from '@/features/evaluations/components/ExpertVerdictField'
import { type Control } from '@/types/controls'
import { type Evidence, type Response, type ResponseVerdict } from '@/types/evaluation'

interface ExpertControlCardProps {
  control: Control
  response: Response | undefined
  evidence: Evidence[]
  readOnly: boolean
  onVerdictChange: (responseId: string, verdict: ResponseVerdict) => void
  onPreviewEvidence: (evidence: Evidence) => void
  onDownloadEvidence: (evidence: Evidence) => void
}

export function ExpertControlCard({
  control,
  response,
  evidence,
  readOnly,
  onVerdictChange,
  onPreviewEvidence,
  onDownloadEvidence,
}: ExpertControlCardProps) {
  return (
    <div className="rounded-[12px] border border-border bg-white p-6 shadow-[0px_2px_6px_rgba(26,26,46,0.05)]">
      <ControlCardMeta control={control} />

      {!response ? (
        <p className="text-sm text-text-muted">Sin respuesta registrada.</p>
      ) : (
        <>
          <ExpertCompanyResponse
            complies={response.answer}
            observations={response.observations}
          />

          <div className="mb-4">
            <p className="mb-2 text-[12px] font-medium text-[#44445a]">Evidencias de la empresa</p>
            <ExpertEvidenceList
              evidence={evidence}
              onPreview={onPreviewEvidence}
              onDownload={onDownloadEvidence}
            />
          </div>

          <ExpertVerdictField
            response={response}
            readOnly={readOnly}
            onVerdictChange={onVerdictChange}
          />
        </>
      )}
    </div>
  )
}
