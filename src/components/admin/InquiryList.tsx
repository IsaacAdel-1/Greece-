"use client";

import { useState } from "react";
import type { Inquiry } from "@/lib/inquiries/types";
import { GenderBadge } from "./GenderBadge";
import { cn, formatDateTime } from "@/lib/utils";

/**
 * Interactive list of contact-form leads. Receives the initial set from the
 * server and keeps a local copy so mark-read / delete feel instant; each action
 * calls the same-origin admin API and reconciles on response.
 */
export function InquiryList({ initial }: { initial: Inquiry[] }) {
  const [items, setItems] = useState<Inquiry[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function toggleRead(item: Inquiry) {
    setBusy(item.id);
    const next = !item.isRead;
    setItems((xs) =>
      xs.map((x) => (x.id === item.id ? { ...x, isRead: next } : x)),
    );
    try {
      const res = await fetch(`/api/admin/inquiries/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure.
      setItems((xs) =>
        xs.map((x) => (x.id === item.id ? { ...x, isRead: !next } : x)),
      );
    } finally {
      setBusy(null);
    }
  }

  async function remove(item: Inquiry) {
    if (!confirm(`Delete the inquiry from ${item.name}? This cannot be undone.`))
      return;
    setBusy(item.id);
    const snapshot = items;
    setItems((xs) => xs.filter((x) => x.id !== item.id));
    try {
      const res = await fetch(`/api/admin/inquiries/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
    } catch {
      setItems(snapshot); // restore
    } finally {
      setBusy(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 border border-dashed border-sand bg-bone/60 p-10 text-center">
        <p className="font-sans text-sm text-clay">
          No inquiries yet. They’ll appear here the moment someone sends the
          contact form.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-8 space-y-4">
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            "border bg-bone p-5 transition-colors",
            item.isRead ? "border-sand" : "border-brass",
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!item.isRead && (
                  <span
                    aria-label="Unread"
                    className="h-2 w-2 shrink-0 rounded-full bg-brass"
                  />
                )}
                <h3 className="truncate font-serif text-xl font-light text-ink">
                  {item.name}
                </h3>
                <GenderBadge
                  gender={item.gender}
                  guess={item.genderGuess}
                  confidence={item.genderConfidence}
                />
              </div>
              <a
                href={`mailto:${item.email}`}
                className="font-sans text-sm text-brass hover:underline"
              >
                {item.email}
              </a>
            </div>
            <time className="shrink-0 font-sans text-xs text-clay">
              {formatDateTime(item.createdAt)}
            </time>
          </div>

          <p className="mt-4 whitespace-pre-wrap font-sans text-sm text-ink">
            {item.message}
          </p>

          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-sans text-xs text-clay">
            {item.productSlug && (
              <div>
                <dt className="inline uppercase tracking-luxe">Piece: </dt>
                <dd className="inline text-ink">{item.productSlug}</dd>
              </div>
            )}
            {(item.city || item.country) && (
              <div>
                <dt className="inline uppercase tracking-luxe">From: </dt>
                <dd className="inline text-ink">
                  {[item.city, item.country].filter(Boolean).join(", ")}
                </dd>
              </div>
            )}
            {(item.device || item.browser) && (
              <div>
                <dt className="inline uppercase tracking-luxe">Device: </dt>
                <dd className="inline text-ink">
                  {[item.device, item.browser].filter(Boolean).join(" · ")}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-4 flex gap-3 border-t border-sand pt-3">
            <button
              type="button"
              onClick={() => toggleRead(item)}
              disabled={busy === item.id}
              className="font-sans text-xs uppercase tracking-luxe text-ink transition-colors hover:text-brass disabled:opacity-50"
            >
              {item.isRead ? "Mark unread" : "Mark read"}
            </button>
            <button
              type="button"
              onClick={() => remove(item)}
              disabled={busy === item.id}
              className="font-sans text-xs uppercase tracking-luxe text-red-700 transition-colors hover:text-red-900 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
