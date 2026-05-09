import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PlusCircleIcon } from "@/components/ui/Icons";

interface AddContactFormProps {
  addName: string;
  addEmail: string;
  addJobTitle: string;
  addError?: string | null;
  setAddName: (value: string) => void;
  setAddEmail: (value: string) => void;
  setAddJobTitle: (value: string) => void;
  onAddContact: () => void;
}

export function AddContactForm({
  addName,
  addEmail,
  addJobTitle,
  addError,
  setAddName,
  setAddEmail,
  setAddJobTitle,
  onAddContact,
}: AddContactFormProps) {
  return (
    <div className="rounded-[10px] border border-dashed border-border bg-[#fdfcfa] p-4">
      <div className="mb-3 flex items-center gap-2 text-[#44445a]">
        <PlusCircleIcon />
        <span className="text-[12.5px] font-medium">Agregar destinatario</span>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          label="Nombre completo"
          maxLength={100}
          value={addName}
          onChange={(e) => setAddName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Correo electrónico"
            type="email"
            maxLength={150}
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
          />
          <Input
            label="Cargo / Puesto"
            maxLength={100}
            value={addJobTitle}
            onChange={(e) => setAddJobTitle(e.target.value)}
          />
        </div>

        {addError && <p className="text-[12px] text-red-500">{addError}</p>}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<PlusCircleIcon />}
          onClick={onAddContact}
          className="self-start border-[#bfdbfe] bg-[#eff4ff] text-primary hover:bg-[#dbeafe]"
        >
          Agregar a la lista
        </Button>
      </div>
    </div>
  );
}
