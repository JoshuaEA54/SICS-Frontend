import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { useRegisterStep1 } from "../hooks/useRegisterStep1";

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

export function RegisterStep1Form() {
  const {
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
  } = useRegisterStep1();

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="rounded-[14px] border border-border bg-white shadow-card">
        {/* Progress bar */}
        <div className="flex items-center gap-3 px-8 pt-8 pb-4">
          <div className="flex flex-1 gap-1">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-[#e8e6f0]" />
          </div>
          <span className="text-[11.5px] font-medium text-text-muted">
            Paso 1 de 2
          </span>
        </div>

        <div className="flex flex-col gap-5 px-8 pb-8">
          <div>
            <h1 className="font-display text-[25.6px] font-semibold tracking-[-0.64px] text-text-primary">
              Datos de la empresa
            </h1>
            <p className="mt-1 text-[14px] font-light text-text-secondary">
              Complete la información de su organización para personalizar la
              evaluación.
            </p>
          </div>

          <Input
            label="Nombre de la empresa"
            required
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Sector"
              required
              options={sectors}
              placeholder="Seleccione"
              error={errors.sector_id?.message}
              {...register("sector_id")}
            />
            <Select
              label="Cantidad de empleados"
              options={employeeRanges}
              placeholder="Seleccione"
              error={errors.employee_range_id?.message}
              {...register("employee_range_id")}
            />
          </div>

          <SectionDivider label="Dirección sede central" />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Provincia"
              required
              options={provinces}
              placeholder="Seleccione"
              error={errors.province_id?.message}
              {...register("province_id")}
            />
            <Select
              label="Cantón"
              required
              options={cantons}
              placeholder="Seleccione"
              error={errors.canton_id?.message}
              disabled={!cantons.length}
              {...register("canton_id")}
            />
          </div>

          <Select
            label="Distrito"
            required
            options={districts}
            placeholder="Seleccione"
            error={errors.district_id?.message}
            disabled={!districts.length}
            {...register("district_id")}
          />

          <SectionDivider label="Sucursales" />

          <ToggleGroup
            label="¿La empresa cuenta con sucursales?"
            required
            options={[
              { value: "true", label: "Sí" },
              { value: "false", label: "No" },
            ]}
            value={hasBranches}
            onChange={(v) =>
              setValue("has_branches", v as "true" | "false", {
                shouldValidate: true,
              })
            }
            error={errors.has_branches?.message}
          />

          {hasBranches === "true" && (
            <div className="border-l-2 border-[#dbeafe] pl-3">
              <Input
                label="Número de sucursales"
                required
                type="number"
                min={1}
                helperText="Indique la cantidad de sucursales adicionales a la sede central."
                error={errors.branch_count?.message}
                {...register("branch_count")}
              />
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            rightIcon={<ArrowRightIcon />}
            className="w-full"
          >
            Continuar
          </Button>
        </div>
      </div>
    </form>
  );
}
