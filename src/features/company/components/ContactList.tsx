import { Avatar } from "@/components/ui/Avatar";
import { MailIcon, TrashIcon } from "@/components/ui/Icons";
import type { ContactCreate } from "@/types/company";

interface ContactListProps {
  contacts: ContactCreate[];
  onRemove: (index: number) => void;
}

export function ContactList({ contacts, onRemove }: ContactListProps) {
  if (contacts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {contacts.map((c, i) => (
        <div
          key={`${c.email}-${i}`}
          className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3"
        >
          <div className="shrink-0">
            <Avatar
              name={c.name}
              size="sm"
              className="bg-[#dbeafe] !text-[#1d4ed8]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="truncate text-[13.6px] font-medium text-text-primary">
                {c.name}
              </span>
              {c.job_title && (
                <span className="shrink-0 text-[12.8px] font-light text-text-muted">
                  {c.job_title}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-text-secondary">
              <MailIcon />
              <span className="text-[12.5px] font-light">{c.email}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="shrink-0 text-text-muted transition-colors hover:text-red-500"
            aria-label="Eliminar contacto"
          >
            <TrashIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
