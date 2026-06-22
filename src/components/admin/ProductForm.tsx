"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Category, Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/**
 * Create/edit form for a single product. Talks to the admin product API and
 * uploads images to Supabase Storage via /api/admin/upload. Subcategory options
 * follow the chosen category. All validation errors from the server are mapped
 * back onto their fields (dot-notation paths).
 */

type Draft = {
  slug: string;
  name: string;
  categorySlug: string;
  subcategorySlug: string;
  summary: string;
  description: string;
  collection: string;
  isFeatured: boolean;
  isNew: boolean;
  width: string;
  depth: string;
  height: string;
  seatHeight: string;
  materials: { name: string; description: string }[];
  images: { src: string; alt: string; width: number; height: number }[];
};

function toDraft(p: Product | null): Draft {
  return {
    slug: p?.slug ?? "",
    name: p?.name ?? "",
    categorySlug: p?.categorySlug ?? "",
    subcategorySlug: p?.subcategorySlug ?? "",
    summary: p?.summary ?? "",
    description: p?.description ?? "",
    collection: p?.collection ?? "",
    isFeatured: p?.isFeatured ?? false,
    isNew: p?.isNew ?? false,
    width: p ? String(p.dimensions.width) : "",
    depth: p ? String(p.dimensions.depth) : "",
    height: p ? String(p.dimensions.height) : "",
    seatHeight: p?.dimensions.seatHeight ? String(p.dimensions.seatHeight) : "",
    materials: p?.materials.map((m) => ({
      name: m.name,
      description: m.description ?? "",
    })) ?? [],
    images: p?.images.map((i) => ({ ...i })) ?? [],
  };
}

export function ProductForm({
  product,
  categories,
  onSaved,
  onCancel,
}: {
  /** Null → create mode. */
  product: Product | null;
  categories: Category[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(product);
  const [draft, setDraft] = useState<Draft>(() => toDraft(product));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const subcategories = useMemo(
    () => categories.find((c) => c.slug === draft.categorySlug)?.subcategories ?? [],
    [categories, draft.categorySlug],
  );

  async function uploadImage(file: File) {
    setUploading(true);
    setFormError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        setFormError(payload?.error ?? "Upload failed.");
        return;
      }
      // Read natural dimensions client-side so next/image avoids layout shift.
      const dims = await readImageSize(payload.url).catch(() => ({
        width: 1200,
        height: 1200,
      }));
      setDraft((d) => ({
        ...d,
        images: [...d.images, { src: payload.url, alt: "", ...dims }],
      }));
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError(null);

    const payload = {
      slug: draft.slug,
      name: draft.name,
      categorySlug: draft.categorySlug,
      subcategorySlug: draft.subcategorySlug,
      summary: draft.summary,
      description: draft.description,
      collection: draft.collection,
      isFeatured: draft.isFeatured,
      isNew: draft.isNew,
      dimensions: {
        width: Number(draft.width),
        depth: Number(draft.depth),
        height: Number(draft.height),
        ...(draft.seatHeight ? { seatHeight: Number(draft.seatHeight) } : {}),
        unit: "cm",
      },
      materials: draft.materials.filter((m) => m.name.trim()),
      images: draft.images,
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${product!.slug}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        onSaved();
        return;
      }
      if (res.status === 422 && data?.fieldErrors) {
        setErrors(data.fieldErrors);
        setFormError("Please fix the highlighted fields.");
      } else {
        setFormError(data?.error ?? "Could not save the product.");
      }
    } catch {
      setFormError("Unable to reach the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 border border-sand bg-bone p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-light text-ink">
          {isEdit ? `Edit “${product!.name}”` : "New product"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="font-sans text-xs uppercase tracking-luxe text-clay hover:text-ink"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Text label="Name" value={draft.name} onChange={(v) => set("name", v)} error={errors.name} />
        <Text
          label="Slug (URL)"
          value={draft.slug}
          onChange={(v) => set("slug", v)}
          error={errors.slug}
          hint="lowercase-with-hyphens"
        />
        <Select
          label="Category"
          value={draft.categorySlug}
          onChange={(v) => setDraft((d) => ({ ...d, categorySlug: v, subcategorySlug: "" }))}
          error={errors.categorySlug}
          options={[{ value: "", label: "Choose…" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
        />
        <Select
          label="Subcategory"
          value={draft.subcategorySlug}
          onChange={(v) => set("subcategorySlug", v)}
          error={errors.subcategorySlug}
          options={[{ value: "", label: "Choose…" }, ...subcategories.map((s) => ({ value: s.slug, label: s.name }))]}
        />
      </div>

      <Text label="Summary" value={draft.summary} onChange={(v) => set("summary", v)} error={errors.summary} />

      <TextArea
        label="Description"
        value={draft.description}
        onChange={(v) => set("description", v)}
        error={errors.description}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Text label="Collection (optional)" value={draft.collection} onChange={(v) => set("collection", v)} />
        <div className="flex items-end gap-6">
          <Checkbox label="Featured" checked={draft.isFeatured} onChange={(v) => set("isFeatured", v)} />
          <Checkbox label="New" checked={draft.isNew} onChange={(v) => set("isNew", v)} />
        </div>
      </div>

      {/* Dimensions */}
      <fieldset>
        <legend className="font-sans text-xs uppercase tracking-luxe text-ink">
          Dimensions (cm)
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Text label="Width" value={draft.width} onChange={(v) => set("width", v)} error={errors["dimensions.width"]} type="number" />
          <Text label="Depth" value={draft.depth} onChange={(v) => set("depth", v)} error={errors["dimensions.depth"]} type="number" />
          <Text label="Height" value={draft.height} onChange={(v) => set("height", v)} error={errors["dimensions.height"]} type="number" />
          <Text label="Seat height" value={draft.seatHeight} onChange={(v) => set("seatHeight", v)} type="number" />
        </div>
      </fieldset>

      {/* Materials */}
      <fieldset>
        <legend className="font-sans text-xs uppercase tracking-luxe text-ink">Materials</legend>
        <div className="mt-2 space-y-2">
          {draft.materials.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Material"
                value={m.name}
                onChange={(e) =>
                  setDraft((d) => {
                    const materials = [...d.materials];
                    materials[i] = { ...materials[i]!, name: e.target.value };
                    return { ...d, materials };
                  })
                }
                className="w-1/3 border border-sand bg-transparent px-3 py-2 font-sans text-sm text-ink outline-none focus:border-brass"
              />
              <input
                placeholder="Detail (optional)"
                value={m.description}
                onChange={(e) =>
                  setDraft((d) => {
                    const materials = [...d.materials];
                    materials[i] = { ...materials[i]!, description: e.target.value };
                    return { ...d, materials };
                  })
                }
                className="flex-1 border border-sand bg-transparent px-3 py-2 font-sans text-sm text-ink outline-none focus:border-brass"
              />
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, materials: d.materials.filter((_, j) => j !== i) }))}
                className="px-2 font-sans text-xs text-red-700 hover:text-red-900"
                aria-label="Remove material"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, materials: [...d.materials, { name: "", description: "" }] }))}
            className="font-sans text-xs uppercase tracking-luxe text-brass hover:underline"
          >
            + Add material
          </button>
        </div>
      </fieldset>

      {/* Images */}
      <fieldset>
        <legend className="font-sans text-xs uppercase tracking-luxe text-ink">
          Images <span className="text-clay">(first is the cover)</span>
        </legend>
        {errors.images && <p className="mt-1 font-sans text-xs text-red-700">{errors.images}</p>}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {draft.images.map((img, i) => (
            <div key={i} className="border border-sand p-2">
              <div className="relative aspect-square bg-sand/40">
                <Image src={img.src} alt={img.alt || "Product image"} fill className="object-cover" sizes="200px" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 font-sans text-[10px] uppercase tracking-luxe text-bone">
                    Cover
                  </span>
                )}
              </div>
              <input
                placeholder="Alt text"
                value={img.alt}
                onChange={(e) =>
                  setDraft((d) => {
                    const images = [...d.images];
                    images[i] = { ...images[i]!, alt: e.target.value };
                    return { ...d, images };
                  })
                }
                className={cn(
                  "mt-2 w-full border bg-transparent px-2 py-1 font-sans text-xs text-ink outline-none focus:border-brass",
                  errors[`images.${i}.alt`] ? "border-red-700" : "border-sand",
                )}
              />
              <div className="mt-1 flex justify-between">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() =>
                    setDraft((d) => {
                      const images = [...d.images];
                      [images[i - 1], images[i]] = [images[i]!, images[i - 1]!];
                      return { ...d, images };
                    })
                  }
                  className="font-sans text-[10px] uppercase tracking-luxe text-clay hover:text-ink disabled:opacity-30"
                >
                  ← Cover
                </button>
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, images: d.images.filter((_, j) => j !== i) }))}
                  className="font-sans text-[10px] uppercase tracking-luxe text-red-700 hover:text-red-900"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 border border-dashed border-sand px-4 py-2 font-sans text-xs uppercase tracking-luxe text-ink hover:border-brass">
          {uploading ? "Uploading…" : "+ Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadImage(f);
              e.target.value = "";
            }}
          />
        </label>
      </fieldset>

      {formError && (
        <p role="alert" className="font-sans text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="flex gap-3 border-t border-sand pt-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-ink px-6 py-3 font-sans text-xs uppercase tracking-luxe text-bone transition-colors hover:bg-brass disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 font-sans text-xs uppercase tracking-luxe text-ink hover:text-brass"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/** Load an image URL and resolve its natural pixel dimensions. */
function readImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const im = new window.Image();
    im.onload = () => resolve({ width: im.naturalWidth || 1200, height: im.naturalHeight || 1200 });
    im.onerror = reject;
    im.src = src;
  });
}

// --- Small field primitives (kept local to this form) ---

function Text({
  label, value, onChange, error, hint, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; hint?: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="block font-sans text-xs uppercase tracking-luxe text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-1 block w-full border bg-transparent px-3 py-2 font-sans text-sm text-ink outline-none focus:border-brass",
          error ? "border-red-700" : "border-sand",
        )}
      />
      {hint && !error && <span className="mt-1 block font-sans text-[10px] text-clay">{hint}</span>}
      {error && <span className="mt-1 block font-sans text-xs text-red-700">{error}</span>}
    </label>
  );
}

function TextArea({
  label, value, onChange, error,
}: { label: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <label className="block">
      <span className="block font-sans text-xs uppercase tracking-luxe text-ink">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-1 block w-full resize-y border bg-transparent px-3 py-2 font-sans text-sm text-ink outline-none focus:border-brass",
          error ? "border-red-700" : "border-sand",
        )}
      />
      {error && <span className="mt-1 block font-sans text-xs text-red-700">{error}</span>}
    </label>
  );
}

function Select({
  label, value, onChange, options, error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; error?: string;
}) {
  return (
    <label className="block">
      <span className="block font-sans text-xs uppercase tracking-luxe text-ink">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-1 block w-full border bg-transparent px-3 py-2 font-sans text-sm text-ink outline-none focus:border-brass",
          error ? "border-red-700" : "border-sand",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="mt-1 block font-sans text-xs text-red-700">{error}</span>}
    </label>
  );
}

function Checkbox({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-brass" />
      <span className="font-sans text-sm text-ink">{label}</span>
    </label>
  );
}
