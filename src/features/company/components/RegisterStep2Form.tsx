import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, ArrowLeftIcon } from "@/components/ui/Icons";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { useAuthStore } from "@/store/authStore";
import { useRegisterStore } from "@/store/registerStore";
import { useRegisterStep2 } from "../hooks/useRegisterStep2";
import { AddContactForm } from "./AddContactForm";
import { ContactList } from "./ContactList";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-surface-alt" />
      <span className="text-[11.2px] font-medium uppercase tracking-[0.896px] text-[#b0aaa0]">
        {label}
      </span>
      <span className="h-px flex-1 bg-surface-alt" />
    </div>
  );
}

export function RegisterStep2Form() {
  const navigate = useNavigate();
  const setCompanyId = useRegisterStore((s) => s.setCompanyId);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user?.company_id) {
      navigate("/registro", { replace: true });
      return;
    }
    // Asegura que registerStore tenga el companyId para la restauración del paso 1 (Volver)
    setCompanyId(String(user.company_id));
  }, [user?.company_id, navigate, setCompanyId]);

  const {
    register,
    errors,
    isSubmitting,
    onSubmit,
    onBack,
    contacts,
    addName,
    addEmail,
    addJobTitle,
    addError,
    setAddName,
    setAddEmail,
    setAddJobTitle,
    handleAddContact,
    handleRemoveContact,
  } = useRegisterStep2();

  if (!user?.company_id) return null;

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="rounded-[14px] border border-border bg-white shadow-card">
        {/* Progress bar */}
        <div className="flex items-center gap-3 px-8 pt-8 pb-4">
          <div className="flex flex-1 gap-1">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-primary" />
          </div>
          <span className="text-[11.5px] font-medium text-text-muted">
            Paso 2 de 2
          </span>
        </div>

        <div className="flex flex-col gap-5 px-8 pb-8">
          <div>
            <h1 className="font-display text-[25.6px] font-semibold tracking-[-0.64px] text-text-primary">
              Responsable e informes
            </h1>
            <p className="mt-1 text-[14px] font-light text-text-secondary">
              Confirme los datos del responsable y agregue a quienes deben
              recibir copia del informe.
            </p>
          </div>

          <Input
            label="Nombre del responsable"
            required
            maxLength={100}
            helperText="Puede modificar el nombre si lo requiere."
            error={errors.responsible_name?.message}
            {...register("responsible_name")}
          />

          <Input
            label="Cargo / Puesto"
            required
            maxLength={100}
            error={errors.responsible_position?.message}
            {...register("responsible_position")}
          />

          <SectionDivider label="Destinatarios del informe" />

          {/* Info banner */}
          <InfoBanner>
            Cuando el experto finalice la revisión, el informe se enviará a{" "}
            <span className="font-medium">{user?.email}</span> y a todas las
            personas que agregue a continuación.
          </InfoBanner>

          {/* Contact list */}
          {contacts.length > 0 && (
            <ContactList contacts={contacts} onRemove={handleRemoveContact} />
          )}

          {/* Add contact form */}
          <AddContactForm
            addName={addName}
            addEmail={addEmail}
            addJobTitle={addJobTitle}
            addError={addError}
            setAddName={setAddName}
            setAddEmail={setAddEmail}
            setAddJobTitle={setAddJobTitle}
            onAddContact={handleAddContact}
          />

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              leftIcon={<ArrowLeftIcon />}
              onClick={onBack}
              className="shrink-0"
            >
              Volver
            </Button>
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              rightIcon={<ArrowRightIcon />}
              className="flex-1"
            >
              Iniciar evaluación
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
