import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth";
import { useMarquee } from "@/hooks/useMarquee";
import { STEPS, STANDARDS, MARQUEE_SPEED } from "./LandingPage.data";

function StandardsMarquee() {
  const trackRef = useMarquee(MARQUEE_SPEED);
  const items = [...STANDARDS, ...STANDARDS];

  return (
    <section className="overflow-hidden border-y border-border bg-surface py-1">
      <div ref={trackRef} className="flex will-change-transform">
        {items.map((s, i) => (
          <div
            key={i}
            className="flex shrink-0 flex-col items-center border-r border-border px-6 py-4 sm:px-12 sm:py-5"
          >
            <span className="text-[14px] font-semibold text-text-primary sm:text-[17px]">
              {s.label}
            </span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-text-muted sm:text-[10.5px]">
              {s.sublabel}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LandingPage() {
  const { handleSuccess, handleError } = useGoogleAuth();

  return (
    <PageLayout>
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1140px] px-4 pb-16 pt-14 text-center sm:px-8 sm:pb-24 sm:pt-20">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[1.382px] text-primary sm:text-[11.5px]">
          Evaluación de Cumplimiento
        </p>
        <h1 className="mx-auto max-w-3xl text-[36px] font-light leading-[1.1] tracking-[-1px] text-text-primary sm:text-[48px] sm:tracking-[-1.5px] lg:text-[60px]">
          Evalúe la madurez de su seguridad{" "}
          <em className="font-bold not-italic">
            en el marco regulatorio costarricense.
          </em>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-relaxed text-text-secondary sm:mt-6 sm:text-[17px]">
          SICS mide el nivel de cumplimiento de sus controles de seguridad de la
          información con base en{" "}
          <span className="font-medium text-text-primary">
            ISO 27001, ISO 27002, ISO 27005, ISO 27701, NIST CSF
          </span>{" "}
          y la <span className="font-medium text-text-primary">Ley 8968</span>.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
          <GoogleLogin
            onSuccess={({ credential }) =>
              credential && handleSuccess(credential)
            }
            onError={handleError}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
          <a
            href="#como-funciona"
            className="text-[14px] font-medium text-text-secondary underline-offset-4 hover:underline sm:text-[15px]"
          >
            ¿Cómo funciona?
          </a>
        </div>
      </section>

      {/* ── Standards carousel ───────────────────────────────────────── */}
      <StandardsMarquee />

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-8">
          <div className="mb-10 text-center sm:mb-14">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[1.382px] text-primary sm:text-[11.5px]">
              Proceso
            </p>
            <h2 className="text-[28px] font-light leading-tight tracking-[-0.6px] text-text-primary sm:text-[36px] sm:tracking-[-0.8px] lg:text-[40px]">
              ¿Cómo funciona?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 28px -6px rgba(0,0,0,0.10)",
                  transition: { type: "spring", stiffness: 350, damping: 25 },
                }}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
              >
                <span className="text-[32px] font-bold leading-none text-primary opacity-20 sm:text-[36px]">
                  {step.number}
                </span>
                <h3 className="mt-3 text-[15px] font-semibold text-text-primary sm:mt-4 sm:text-[16px]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] font-light leading-relaxed text-text-secondary sm:text-[14px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-8">
          <span className="text-[15px] font-bold text-text-primary">SICS</span>
          <p className="text-[12px] text-text-muted">
            © {new Date().getFullYear()} Sistema Integrado de Cumplimiento en
            Seguridad.
          </p>
        </div>
      </footer>
    </PageLayout>
  );
}
