"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  validateInquiry,
  type InquiryFieldErrors,
} from "@/lib/validation/inquiry";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Accessible, validated contact form.
 *
 * - Validates client-side with the SAME Zod schema the API uses, so users get
 *   instant feedback while the server remains the source of truth.
 * - Includes a visually-hidden honeypot (`company`) for spam protection.
 * - Errors are associated to inputs via aria-describedby; the live region
 *   announces submission outcomes to screen readers.
 */
export function ContactForm() {
  const searchParams = useSearchParams();
  // Pre-fill the piece of interest when arriving from a product page.
  const piece = searchParams.get("piece") ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Client-side validation first.
    const result = validateInquiry(data);
    if (!result.success) {
      setErrors(result.errors);
      setStatus("error");
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      const payload = await res.json().catch(() => null);
      if (res.status === 422 && payload?.fieldErrors) {
        setErrors(payload.fieldErrors as InquiryFieldErrors);
        setStatus("error");
      } else {
        setFormError(
          payload?.error ?? "Something went wrong. Please try again.",
        );
        setStatus("error");
      }
    } catch {
      setFormError("Unable to reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border border-sand bg-sand/30 p-8 text-center"
      >
        <h3 className="font-serif text-2xl font-light text-ink">
          Thank you — your message is on its way.
        </h3>
        <p className="mt-3 font-sans text-base text-clay">
          We respond to every inquiry personally, usually within two business
          days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot: hidden from users, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        id="name"
        label="Name"
        error={errors.name}
        autoComplete="name"
        required
      />
      <Field
        id="email"
        label="Email"
        type="email"
        error={errors.email}
        autoComplete="email"
        required
      />

      <div>
        <label
          htmlFor="gender"
          className="block font-sans text-xs uppercase tracking-luxe text-ink"
        >
          Gender <span className="text-clay">(optional)</span>
        </label>
        <select
          id="gender"
          name="gender"
          defaultValue=""
          className="mt-2 block w-full border border-sand bg-transparent px-4 py-3 font-sans text-base text-ink outline-none transition-colors focus:border-brass"
        >
          <option value="">Prefer not to say</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>

      {/* Carry the piece of interest through; read-only context if present. */}
      <input type="hidden" name="productSlug" defaultValue={piece} />
      {piece && (
        <p className="font-sans text-xs text-clay">
          Inquiring about: <span className="text-ink">{piece}</span>
        </p>
      )}

      <div>
        <label
          htmlFor="message"
          className="block font-sans text-xs uppercase tracking-luxe text-ink"
        >
          Message <span className="text-brass">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            "mt-2 block w-full resize-y border bg-transparent px-4 py-3 font-sans text-base text-ink outline-none transition-colors focus:border-brass",
            errors.message ? "border-red-700" : "border-sand",
          )}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 font-sans text-xs text-red-700">
            {errors.message}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="font-sans text-sm text-red-700">
          {formError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={status === "submitting"}
        className="w-full justify-center sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send Inquiry"}
      </Button>

      {/* Live region for assistive tech. */}
      <p className="sr-only" aria-live="polite">
        {status === "submitting" ? "Submitting your inquiry" : ""}
      </p>
    </form>
  );
}

/** A labelled text input with inline error handling. */
function Field({
  id,
  label,
  type = "text",
  error,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-sans text-xs uppercase tracking-luxe text-ink"
      >
        {label} {required && <span className="text-brass">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "mt-2 block w-full border bg-transparent px-4 py-3 font-sans text-base text-ink outline-none transition-colors focus:border-brass",
          error ? "border-red-700" : "border-sand",
        )}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 font-sans text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
