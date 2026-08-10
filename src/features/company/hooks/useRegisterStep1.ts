import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { companiesApi } from "@/lib/api/companies";
import { geographyApi } from "@/lib/api/geography";
import { useAuthStore } from "@/store/authStore";
import { useRegisterStore } from "@/store/registerStore";
import {
  registerStep1Schema,
  type RegisterStep1FormValues,
} from "@/types/company";
import { scrollToFirstError, type SelectOption } from "./registerStep1Helpers";
import { useGeographyCascade } from "./useGeographyCascade";

export function useRegisterStep1() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const companyId = user?.company_id ? String(user.company_id) : null;
  const setStep1Data = useRegisterStore((s) => s.setStep1Data);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
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

  const provinceId = watch("province_id");
  const cantonId = watch("canton_id");
  const hasBranches = watch("has_branches");

  // Load static catalogs on mount
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

  const { cantons, districts } = useGeographyCascade({
    companyId,
    provinceId,
    cantonId,
    setValue,
    reset,
  });

  const onSubmit = handleSubmit(
    async (data) => {
      const payload = {
        name: data.name,
        sector_id: Number(data.sector_id),
        employee_range_id: Number(data.employee_range_id),
        district_id: Number(data.district_id),
        branch_count:
          data.has_branches === "true" && data.branch_count
            ? Number(data.branch_count)
            : 0,
      };

      if (companyId) {
        // Usuario volvió al paso 1 para corregir — empresa y usuario ya existen
        await companiesApi.updateCompany(companyId, payload);
      } else {
        // Primera vez — crear empresa y usuario en el mismo request
        const tokenData = await companiesApi.create(payload);
        setAuth(
          tokenData.user,
          tokenData.access_token,
          tokenData.refresh_token,
          tokenData.flow,
        );
      }

      setStep1Data({
        name: data.name,
        sector_id: data.sector_id,
        employee_range_id: data.employee_range_id,
        province_id: data.province_id,
        canton_id: data.canton_id,
        district_id: data.district_id,
        has_branches: data.has_branches as "true" | "false",
        branch_count: data.branch_count ?? "",
      });
      navigate("/registro/paso-2");
    },
    (errors) => scrollToFirstError(errors),
  );

  return {
    control,
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
