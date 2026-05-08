import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { companiesApi } from "@/lib/api/companies";
import { geographyApi } from "@/lib/api/geography";
import { useRegisterStore } from "@/store/registerStore";
import {
  registerStep1Schema,
  type RegisterStep1FormValues,
  type CompanyCreateStep1,
} from "@/types/company";

type SelectOption = { value: string | number; label: string };

const FIELD_ORDER: Array<keyof RegisterStep1FormValues> = [
  "name",
  "sector_id",
  "employee_range_id",
  "province_id",
  "canton_id",
  "district_id",
  "has_branches",
  "branch_count",
];

function scrollToFirstError(
  errors: Partial<Record<keyof RegisterStep1FormValues, unknown>>,
) {
  const firstField = FIELD_ORDER.find((f) => errors[f]);
  if (!firstField) return;
  const el = document.querySelector<HTMLElement>(`[name="${firstField}"]`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function useRegisterStep1() {
  const navigate = useNavigate();
  const setStep1 = useRegisterStore((s) => s.setStep1);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<RegisterStep1FormValues>({
    resolver: zodResolver(registerStep1Schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      sector_id: "",
      employee_range_id: "",
      province_id: "",
      canton_id: "",
      district_id: "",
      has_branches: "false",
      branch_count: "",
    },
  });

  const [sectors, setSectors] = useState<SelectOption[]>([]);
  const [employeeRanges, setEmployeeRanges] = useState<SelectOption[]>([]);
  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [cantons, setCantons] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);

  const provinceId = watch("province_id");
  const cantonId = watch("canton_id");
  const hasBranches = watch("has_branches");

  useEffect(() => {
    Promise.all([
      companiesApi.getSectors(),
      companiesApi.getEmployeeRanges(),
      geographyApi.getProvinces(),
    ]).then(([s, e, p]) => {
      setSectors(s.map((x) => ({ value: x.id, label: x.name })));
      setEmployeeRanges(e.map((x) => ({ value: x.id, label: x.label })));
      setProvinces(p.map((x) => ({ value: x.id, label: x.name })));
    });
  }, []);

  useEffect(() => {
    if (!provinceId) return;
    setValue("canton_id", "");
    setValue("district_id", "");
    setCantons([]);
    setDistricts([]);
    geographyApi
      .getCantons(Number(provinceId))
      .then((data) =>
        setCantons(data.map((x) => ({ value: x.id, label: x.name }))),
      );
  }, [provinceId]);

  useEffect(() => {
    if (!cantonId) return;
    setValue("district_id", "");
    setDistricts([]);
    geographyApi
      .getDistricts(Number(cantonId))
      .then((data) =>
        setDistricts(data.map((x) => ({ value: x.id, label: x.name }))),
      );
  }, [cantonId]);

  const onSubmit = handleSubmit(
    (data) => {
      const payload: CompanyCreateStep1 = {
        name: data.name,
        sector_id: data.sector_id,
        employee_range_id: data.employee_range_id || undefined,
        district_id: Number(data.district_id),
        has_branches: data.has_branches === "true",
        branch_count:
          data.has_branches === "true" && data.branch_count
            ? Number(data.branch_count)
            : undefined,
      };
      setStep1(payload);
      navigate("/registro/paso-2");
    },
    (errors) => scrollToFirstError(errors),
  );

  return {
    register,
    errors,
    isSubmitting,
    onSubmit,
    sectors,
    employeeRanges,
    provinces,
    cantons,
    districts,
    hasBranches,
    setValue,
  };
}
