import { Button } from "@/components/ui/Button";
import { XIcon } from "@/components/ui/Icons";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id="confirm-dialog-title"
            className="font-display text-lg font-semibold text-text-primary"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-alt hover:text-text-primary disabled:opacity-50"
            aria-label="Cerrar"
          >
            <XIcon />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-text-secondary">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            loading={loading}
            onClick={onConfirm}
            className="bg-teal hover:!bg-teal hover:brightness-110"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
