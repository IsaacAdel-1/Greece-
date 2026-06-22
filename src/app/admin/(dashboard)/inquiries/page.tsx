import { listInquiries } from "@/lib/inquiries/repository";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { InquiryList } from "@/components/admin/InquiryList";

// Always render fresh — leads change constantly and must never be cached.
export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await listInquiries();

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-ink">Inquiries</h1>
      <p className="mt-2 font-sans text-base text-clay">
        Everyone who reached out through the contact form, newest first.
      </p>

      {!isSupabaseConfigured() && (
        <p className="mt-4 border border-dashed border-sand bg-bone/60 p-3 font-sans text-xs text-clay">
          Supabase isn’t configured yet, so inquiries are stored in memory and
          reset when the server restarts. Add your Supabase keys to persist them.
        </p>
      )}

      <InquiryList initial={inquiries} />
    </div>
  );
}
