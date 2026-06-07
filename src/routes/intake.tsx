import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { SplashScreen } from "@/components/site/SplashScreen";
import { submitPublicIntake } from "@/lib/onboarding.functions";
import {
  ENTITY_TYPES,
  SECTORS,
  ENTITY_STAGES,
  ENGAGEMENT_AREAS,
  PRESSURE_POINTS,
  intakeSchema,
  type IntakeData,
} from "@/lib/schemas";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Send } from "lucide-react";

export const Route = createFileRoute("/intake")({
  component: IntakePage,
  head: () => ({
    meta: [
      { title: "Start Intake — SautiApex" },
      {
        name: "description",
        content:
          "Begin a confidential SautiApex intake. Tell us about your entity, sector and the pressure points you're facing.",
      },
      { property: "og:title", content: "Start Intake — SautiApex" },
      {
        property: "og:description",
        content:
          "Begin a confidential SautiApex intake. Tell us about your entity, sector and the pressure points you're facing.",
      },
      { property: "og:url", content: "/intake" },
    ],
    links: [{ rel: "canonical", href: "/intake" }],
  }),
});

type FormState = IntakeData;

const initial: FormState = {
  entity_type: "registered_company",
  display_name: "",
  contact_email: "",
  phone: "",
  country: "Kenya",
  city: "",
  sector: "",
  stage: "Operating",
  engagement_areas: [],
  pressure_points: [],
  confidentiality_level: "standard",
  preferred_channel: "email",
  contact_window: "",
  abstract_note: "",
};

const steps = ["Entity", "Focus", "Privacy", "Review"] as const;

function IntakePage() {
  const nav = useNavigate();
  const submitIntake = useServerFn(submitPublicIntake);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const toggle = (k: "engagement_areas" | "pressure_points", v: string) =>
    setForm((s) => {
      const list = s[k];
      return { ...s, [k]: list.includes(v) ? list.filter((x) => x !== v) : [...list, v] };
    });

  const next = () => {
    if (step === 0) {
      if (!form.display_name.trim()) return toast.error("Please tell us your name or entity.");
      if (!/^\S+@\S+\.\S+$/.test(form.contact_email))
        return toast.error("Please enter a valid email.");
    }
    if (step === 1 && form.engagement_areas.length === 0) {
      return toast.error("Pick at least one focus area.");
    }
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = async () => {
    if (!agree) return toast.error("Please accept the privacy notice to continue.");
    const parsed = intakeSchema.safeParse(form);
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }
    setSubmitting(true);
    const d = parsed.data;
    const notes = [
      `Entity type: ${d.entity_type}`,
      d.country || d.city ? `Location: ${[d.city, d.country].filter(Boolean).join(", ")}` : null,
      d.sector ? `Sector: ${d.sector}` : null,
      d.stage ? `Stage: ${d.stage}` : null,
      `Focus areas: ${d.engagement_areas.join(", ")}`,
      d.pressure_points.length ? `Pressure points: ${d.pressure_points.join(", ")}` : null,
      `Confidentiality: ${d.confidentiality_level}`,
      `Preferred contact: ${d.preferred_channel}${d.contact_window ? ` (${d.contact_window})` : ""}`,
      d.abstract_note ? `\nBrief note: ${d.abstract_note}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await submitIntake({ data: d });
      toast.success(
        "Thank you. Your intake has been received — we'll be in touch within 1–2 business days.",
      );
      nav({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not submit intake.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <SplashScreen always />
      <PageHeader
        kicker="Confidential Intake"
        title="Tell us where you are. We'll meet you there."
        subtitle="A short, structured intake helps us match you with the right team and prepare for our first conversation."
      />
      <section className="mx-auto max-w-3xl px-6 py-14">
        <Stepper current={step} />

        <div className="mt-8 rounded-xl border border-border bg-card shadow-sm p-6 md:p-8">
          {step === 0 && <StepEntity form={form} set={set} />}
          {step === 1 && <StepFocus form={form} set={set} toggle={toggle} />}
          {step === 2 && <StepPrivacy form={form} set={set} />}
          {step === 3 && <StepReview form={form} agree={agree} setAgree={setAgree} />}

          <div className="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-border">
            <button
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition disabled:opacity-40"
            >
              <ArrowLeft size={14} /> Back
            </button>
            {step < steps.length - 1 ? (
              <button
                onClick={next}
                className="inline-flex items-center gap-2 rounded-md bg-brand-navy text-brand-cream px-5 py-2.5 text-sm font-semibold hover:bg-brand-navy-deep transition"
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-brand-gold text-brand-navy px-5 py-2.5 text-sm font-semibold hover:bg-brand-gold-deep transition disabled:opacity-50"
              >
                <Send size={14} /> {submitting ? "Submitting…" : "Submit intake"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-brand-gold-deep mt-0.5 shrink-0" />
          <span>
            Your information is encrypted and shared only with the SautiApex team handling your
            engagement.
          </span>
        </div>
      </section>
    </SiteLayout>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <li key={label} className="flex-1 flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border transition
                ${done ? "bg-brand-navy text-brand-cream border-brand-navy" : ""}
                ${active ? "bg-brand-gold text-brand-navy border-brand-gold" : ""}
                ${!done && !active ? "bg-background text-muted-foreground border-border" : ""}`}
            >
              {done ? <Check size={14} /> : i + 1}
            </span>
            <span
              className={`text-xs font-medium uppercase tracking-wider ${active ? "text-brand-navy" : "text-muted-foreground"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 && <span className="flex-1 h-px bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

function StepEntity({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle
        title="Who's reaching out?"
        subtitle="We use this to address you correctly and assign the right partner."
      />
      <Select
        label="Entity type"
        value={form.entity_type}
        onChange={(v) => set("entity_type", v as FormState["entity_type"])}
        options={ENTITY_TYPES.map((e) => ({ value: e.value, label: e.label }))}
      />
      <Field
        label="Your name or entity name"
        value={form.display_name}
        onChange={(v) => set("display_name", v)}
        maxLength={120}
        required
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Field
          label="Email"
          type="email"
          value={form.contact_email}
          onChange={(v) => set("contact_email", v)}
          maxLength={255}
          required
        />
        <Field
          label="Phone (optional)"
          value={form.phone ?? ""}
          onChange={(v) => set("phone", v)}
          maxLength={40}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field
          label="Country"
          value={form.country ?? ""}
          onChange={(v) => set("country", v)}
          maxLength={80}
        />
        <Field
          label="City"
          value={form.city ?? ""}
          onChange={(v) => set("city", v)}
          maxLength={80}
        />
      </div>
    </div>
  );
}

function StepFocus({
  form,
  set,
  toggle,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  toggle: (k: "engagement_areas" | "pressure_points", v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="What are we focused on?"
        subtitle="Select all that apply — we'll refine together."
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Sector"
          value={form.sector ?? ""}
          onChange={(v) => set("sector", v)}
          options={[
            { value: "", label: "Select a sector" },
            ...SECTORS.map((s) => ({ value: s, label: s })),
          ]}
        />
        <Select
          label="Stage"
          value={form.stage ?? ""}
          onChange={(v) => set("stage", v)}
          options={ENTITY_STAGES.map((s) => ({ value: s, label: s }))}
        />
      </div>

      <ChipGroup
        label="Focus areas (pick at least one)"
        options={[...ENGAGEMENT_AREAS]}
        selected={form.engagement_areas}
        onToggle={(v) => toggle("engagement_areas", v)}
      />

      <ChipGroup
        label="Pressure points (optional)"
        options={[...PRESSURE_POINTS]}
        selected={form.pressure_points}
        onToggle={(v) => toggle("pressure_points", v)}
      />

      <Textarea
        label="A short note (optional)"
        value={form.abstract_note ?? ""}
        onChange={(v) => set("abstract_note", v)}
        maxLength={500}
        placeholder="A few lines about what prompted this enquiry. Avoid confidential numbers or names — we'll discuss those privately."
      />
    </div>
  );
}

function StepPrivacy({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="How would you like us to engage?"
        subtitle="We tailor confidentiality and communication to your situation."
      />
      <RadioGroup
        label="Confidentiality level"
        value={form.confidentiality_level}
        onChange={(v) => set("confidentiality_level", v as FormState["confidentiality_level"])}
        options={[
          { value: "standard", label: "Standard", hint: "Normal client confidentiality." },
          { value: "elevated", label: "Elevated", hint: "Restrict to senior partners only." },
          {
            value: "nda_required",
            label: "NDA required",
            hint: "Sign an NDA before our first conversation.",
          },
        ]}
      />
      <RadioGroup
        label="Preferred channel"
        value={form.preferred_channel}
        onChange={(v) => set("preferred_channel", v as FormState["preferred_channel"])}
        options={[
          { value: "email", label: "Email" },
          { value: "phone", label: "Phone call" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "in_person", label: "In person" },
        ]}
      />
      <Field
        label="Best time to reach you (optional)"
        value={form.contact_window ?? ""}
        onChange={(v) => set("contact_window", v)}
        maxLength={120}
        placeholder="e.g. Weekdays 9am–12pm EAT"
      />
    </div>
  );
}

function StepReview({
  form,
  agree,
  setAgree,
}: {
  form: FormState;
  agree: boolean;
  setAgree: (v: boolean) => void;
}) {
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="grid grid-cols-3 gap-3 py-2 border-b border-border/60 text-sm last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-foreground">{value || "—"}</dd>
    </div>
  );
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Review and submit"
        subtitle="Double-check before sending. We'll respond within 1–2 business days."
      />
      <dl className="rounded-lg border border-border p-5 bg-secondary/30">
        <Row
          label="Entity"
          value={`${form.display_name} (${ENTITY_TYPES.find((e) => e.value === form.entity_type)?.label})`}
        />
        <Row
          label="Contact"
          value={`${form.contact_email}${form.phone ? ` · ${form.phone}` : ""}`}
        />
        <Row label="Location" value={[form.city, form.country].filter(Boolean).join(", ")} />
        <Row label="Sector / Stage" value={[form.sector, form.stage].filter(Boolean).join(" · ")} />
        <Row label="Focus areas" value={form.engagement_areas.join(", ")} />
        <Row label="Pressure points" value={form.pressure_points.join(", ")} />
        <Row label="Confidentiality" value={form.confidentiality_level} />
        <Row
          label="Preferred channel"
          value={`${form.preferred_channel}${form.contact_window ? ` (${form.contact_window})` : ""}`}
        />
        {form.abstract_note && <Row label="Note" value={form.abstract_note} />}
      </dl>

      <label className="flex items-start gap-2 text-sm text-foreground/80 cursor-pointer">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-input accent-brand-navy"
        />
        <span>
          I consent to SautiApex processing this enquiry in accordance with the{" "}
          <a href="/privacy" className="underline hover:text-brand-navy">
            Privacy Policy
          </a>
          . I understand no confidential numbers, names or trade secrets should be shared in this
          form.
        </span>
      </label>
    </div>
  );
}

/* ---------- primitives ---------- */

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="font-serif text-xl md:text-2xl text-brand-navy">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  maxLength,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <textarea
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition resize-none"
      />
      {maxLength && (
        <div className="mt-1 text-[11px] text-muted-foreground text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              type="button"
              key={o}
              onClick={() => onToggle(o)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition
                ${
                  active
                    ? "bg-brand-navy text-brand-cream border-brand-navy"
                    : "bg-background text-foreground/80 border-border hover:border-brand-gold"
                }`}
            >
              {active && <Check size={11} className="inline mr-1 -mt-0.5" />}
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; hint?: string }[];
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <label
              key={o.value}
              className={`flex items-start gap-2.5 rounded-lg border p-3 cursor-pointer transition
              ${active ? "border-brand-gold bg-brand-gold/5" : "border-border hover:border-brand-gold/50"}`}
            >
              <input
                type="radio"
                checked={active}
                onChange={() => onChange(o.value)}
                className="mt-0.5 h-4 w-4 accent-brand-navy"
              />
              <span>
                <span className="block text-sm font-semibold text-foreground">{o.label}</span>
                {o.hint && <span className="block text-xs text-muted-foreground">{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
