"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/lib/catalog/types";
import { ProductForm } from "./ProductForm";

/**
 * Top-level product management: a gallery of existing products with edit/delete,
 * plus an inline create/edit form. After any write it refreshes the server
 * component so the list reflects the database.
 */
export function ProductManager({
  products,
  categories,
  supabaseConfigured,
}: {
  products: Product[];
  categories: Category[];
  supabaseConfigured: boolean;
}) {
  const router = useRouter();
  // null = closed; "new" = create; Product = edit that product.
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  async function importSeed() {
    if (!confirm("Import the built-in starter catalogue into your database?"))
      return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        alert(data?.error ?? "Import failed.");
        return;
      }
      router.refresh();
    } finally {
      setSeeding(false);
    }
  }

  function categoryName(slug: string) {
    return categories.find((c) => c.slug === slug)?.name ?? slug;
  }

  async function remove(p: Product) {
    if (!confirm(`Delete “${p.name}”? This cannot be undone.`)) return;
    setBusy(p.slug);
    try {
      const res = await fetch(`/api/admin/products/${p.slug}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        alert(data?.error ?? "Could not delete the product.");
        return;
      }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  function onSaved() {
    setEditing(null);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="mt-8">
        <ProductForm
          product={editing === "new" ? null : editing}
          categories={categories}
          onSaved={onSaved}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="bg-ink px-6 py-3 font-sans text-xs uppercase tracking-luxe text-bone transition-colors hover:bg-brass"
        >
          + Add product
        </button>
        {supabaseConfigured && products.length === 0 && (
          <button
            type="button"
            onClick={importSeed}
            disabled={seeding}
            className="border border-sand px-6 py-3 font-sans text-xs uppercase tracking-luxe text-ink transition-colors hover:border-brass disabled:opacity-60"
          >
            {seeding ? "Importing…" : "Import starter catalogue"}
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="mt-8 border border-dashed border-sand bg-bone/60 p-10 text-center">
          <p className="font-sans text-sm text-clay">
            No products yet. Add your first piece above.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.slug} className="border border-sand bg-bone">
              <div className="relative aspect-[4/3] bg-sand/40">
                {p.images[0] && (
                  <Image
                    src={p.images[0].src}
                    alt={p.images[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                <div className="absolute left-2 top-2 flex gap-1">
                  {p.isFeatured && (
                    <span className="bg-brass px-1.5 py-0.5 font-sans text-[10px] uppercase tracking-luxe text-bone">
                      Featured
                    </span>
                  )}
                  {p.isNew && (
                    <span className="bg-ink px-1.5 py-0.5 font-sans text-[10px] uppercase tracking-luxe text-bone">
                      New
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg font-light text-ink">{p.name}</h3>
                <p className="mt-1 font-sans text-xs uppercase tracking-luxe text-clay">
                  {categoryName(p.categorySlug)}
                </p>
                <div className="mt-3 flex gap-3 border-t border-sand pt-3">
                  <button
                    type="button"
                    onClick={() => setEditing(p)}
                    className="font-sans text-xs uppercase tracking-luxe text-ink hover:text-brass"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p)}
                    disabled={busy === p.slug}
                    className="font-sans text-xs uppercase tracking-luxe text-red-700 hover:text-red-900 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
