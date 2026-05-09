import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api/auth";
import { companiesApi } from "@/lib/api/companies";
import { evaluationsApi } from "@/lib/api/evaluations";
import { useAuthStore } from "@/store/authStore";
import { useRegisterStore } from "@/store/registerStore";
import {
  registerStep2Schema,
  type RegisterStep2FormValues,
  type ContactCreate,
} from "@/types/company";
import { toastError } from "@/store/toastStore";

export function useRegisterStep2() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearRegister = useRegisterStore((s) => s.clear);

  const [contacts, setContacts] = useState<ContactCreate[]>([]);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addJobTitle, setAddJobTitle] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStep2FormValues>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      responsible_name: user?.name ?? "",
      responsible_position: "",
    },
  });

  function handleAddContact() {
    if (!addName.trim() || !addEmail.trim()) {
      setAddError("Nombre y correo son requeridos.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addEmail.trim())) {
      setAddError("Ingrese un correo válido.");
      return;
    }
    setAddError(null);
    setContacts((prev) => [
      ...prev,
      {
        name: addName.trim(),
        email: addEmail.trim(),
        job_title: addJobTitle.trim() || undefined,
      },
    ]);
    setAddName("");
    setAddEmail("");
    setAddJobTitle("");
  }

  function handleRemoveContact(index: number) {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  }

  const onSubmit = handleSubmit(async (data) => {
    if (!user?.company_id) {
      navigate("/registro");
      return;
    }
    setIsSubmitting(true);
    try {
      const tokenData = await authApi.register({
        name: data.responsible_name,
        job_title: data.responsible_position,
      });

      const newUser = tokenData.user ?? user;
      setAuth(
        newUser,
        tokenData.access_token,
        tokenData.refresh_token,
        tokenData.flow,
      );

      const evaluation = await evaluationsApi.createEvaluation(user.company_id!);

      await Promise.all(
        contacts.map((c) => companiesApi.addContact(user.company_id!, c)),
      );

      clearRegister();
      navigate(`/cuestionario/${evaluation.id}`);
    } catch (err) {
      toastError(
        "Ocurrió un error al completar el registro. Intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  function onBack() {
    navigate("/registro");
  }

  return {
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
  };
}
