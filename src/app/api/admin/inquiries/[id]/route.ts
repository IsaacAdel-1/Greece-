import { NextResponse, type NextRequest } from "next/server";
import { isSameOrigin } from "@/lib/http";
import { deleteInquiry, setInquiryRead } from "@/lib/inquiries/repository";

/**
 * Admin inquiry actions. Auth is enforced by the middleware for all
 * /api/admin/* routes; we add a same-origin check here as CSRF defense-in-depth
 * for these state-changing verbs.
 */

export const runtime = "nodejs";

function forbidIfCrossSite(req: NextRequest): NextResponse | null {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = forbidIfCrossSite(req);
  if (blocked) return blocked;

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const isRead =
    body && typeof body === "object" && "isRead" in body
      ? Boolean((body as Record<string, unknown>).isRead)
      : true;

  const ok = await setInquiryRead(id, isRead);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = forbidIfCrossSite(req);
  if (blocked) return blocked;

  const { id } = await params;
  const ok = await deleteInquiry(id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
