import type { RegisterStep1FormValues } from "@/types/company";

export type SelectOption = { value: string | number; label: string };

export const FIELD_ORDER: Array<keyof RegisterStep1FormValues> = [
  "name",
  "sector_id",
  "employee_range_id",
  "province_id",
  "canton_id",
  "district_id",
  "has_branches",
  "branch_count",
];

export function scrollToFirstError(
  errors: Partial<Record<keyof RegisterStep1FormValues, unknown>>,
) {
  const firstField = FIELD_ORDER.find((f) => errors[f]);
  if (!firstField) return;
  const el = document.querySelector<HTMLElement>(`[name="${firstField}"]`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}
