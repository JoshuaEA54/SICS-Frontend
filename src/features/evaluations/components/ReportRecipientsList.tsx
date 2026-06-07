import { type ReportRecipient } from '@/types/evaluation'

interface ReportRecipientsListProps {
  recipients: ReportRecipient[]
}

export function ReportRecipientsList({ recipients }: ReportRecipientsListProps) {
  if (recipients.length === 0) {
    return (
      <p className="text-sm text-text-secondary">No hay destinatarios registrados para esta empresa.</p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {recipients.map((recipient) => (
        <li
          key={recipient.email}
          className="rounded-lg border border-border bg-surface-bg px-3 py-2 text-sm"
        >
          <span className="font-medium text-text-primary">{recipient.label}</span>
          <span className="block text-text-secondary">{recipient.email}</span>
        </li>
      ))}
    </ul>
  )
}
