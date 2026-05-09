import { useEffect, useRef, useState } from "react";
import type { UseFormReset, UseFormSetValue } from "react-hook-form";
import { geographyApi } from "@/lib/api/geography";
import { companiesApi } from "@/lib/api/companies";
import { useRegisterStore, type Step1PersistedData } from "@/store/registerStore";
import type { RegisterStep1FormValues } from "@/types/company";
import type { SelectOption } from "./registerStep1Helpers";

interface Params {
  provinceId: string;
  cantonId: string;
  setValue: UseFormSetValue<RegisterStep1FormValues>;
  reset: UseFormReset<RegisterStep1FormValues>;
}

interface Result {
  cantons: SelectOption[];
  districts: SelectOption[];
}

export function useGeographyCascade({ provinceId, cantonId, setValue, reset }: Params): Result {
  const companyId = useRegisterStore((s) => s.companyId);
  const step1Data = useRegisterStore((s) => s.step1Data);
  const setStep1Data = useRegisterStore((s) => s.setStep1Data);

  const [cantons, setCantons] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);

  // Prevents cascade effects from resetting canton/district during form restoration
  const skipCascadeRef = useRef(false);

  // Restore form from persisted data or fetch from DB if localStorage is empty
  useEffect(() => {
    if (!companyId) return;

    if (step1Data) {
      // Escenario A: valores del formulario vienen de localStorage (step1Data),
      // pero las opciones de cantones/distritos deben cargarse desde el API
      skipCascadeRef.current = true;
      Promise.all([
        geographyApi.getCantons(Number(step1Data.province_id)),
        geographyApi.getDistricts(Number(step1Data.canton_id)),
      ]).then(([cantonsData, districtsData]) => {
        setCantons(cantonsData.map((x) => ({ value: x.id, label: x.name })));
        setDistricts(districtsData.map((x) => ({ value: x.id, label: x.name })));
        reset(step1Data);
        setTimeout(() => { skipCascadeRef.current = false; }, 0);
      });
      return;
    }

    // Escenario B: companyId existe pero sin step1Data → fetch desde DB y cachear
    (async () => {
      const company = await companiesApi.getCompany(companyId);
      const district = await geographyApi.getDistrict(company.district_id);
      const canton = await geographyApi.getCanton(district.canton_id);

      const fetched: Step1PersistedData = {
        name: company.name,
        sector_id: String(company.sector_id),
        employee_range_id: String(company.employee_range_id),
        province_id: String(canton.province_id),
        canton_id: String(district.canton_id),
        district_id: String(company.district_id),
        has_branches: (company.branch_count ?? 0) > 0 ? "true" : "false",
        branch_count: (company.branch_count ?? 0) > 0 ? String(company.branch_count) : "",
      };
      setStep1Data(fetched);

      skipCascadeRef.current = true;
      const [cantonsData, districtsData] = await Promise.all([
        geographyApi.getCantons(canton.province_id),
        geographyApi.getDistricts(district.canton_id),
      ]);
      setCantons(cantonsData.map((x) => ({ value: x.id, label: x.name })));
      setDistricts(districtsData.map((x) => ({ value: x.id, label: x.name })));
      reset(fetched);
      setTimeout(() => { skipCascadeRef.current = false; }, 0);
    })();
  }, []);

  useEffect(() => {
    if (!provinceId || skipCascadeRef.current) return;
    setValue("canton_id", "");
    setValue("district_id", "");
    setCantons([]);
    setDistricts([]);
    geographyApi
      .getCantons(Number(provinceId))
      .then((data) => setCantons(data.map((x) => ({ value: x.id, label: x.name }))));
  }, [provinceId]);

  useEffect(() => {
    if (!cantonId || skipCascadeRef.current) return;
    setValue("district_id", "");
    setDistricts([]);
    geographyApi
      .getDistricts(Number(cantonId))
      .then((data) => setDistricts(data.map((x) => ({ value: x.id, label: x.name }))));
  }, [cantonId]);

  return { cantons, districts };
}
