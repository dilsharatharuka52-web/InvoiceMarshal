import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAppUser } from "@/lib/auth-user";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  let user;
  try {
    user = await requireAppUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { invoiceId } = await params;
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
    select: { pdfUrl: true },
  });

  if (!invoice?.pdfUrl) {
    return NextResponse.json({ error: "PDF not available" }, { status: 404 });
  }

  const pathname = new URL(invoice.pdfUrl).pathname.slice(1);
  if (!pathname) {
    return NextResponse.json({ error: "Invalid PDF path" }, { status: 500 });
  }

  const result = await get(pathname, {
    access: "private",
    ifNoneMatch: _request.headers.get("if-none-match") ?? undefined,
  });

  if (!result) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (result.statusCode === 304) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: result.blob.etag,
        "Cache-Control": "private, no-cache",
      },
    });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      ETag: result.blob.etag,
      "Cache-Control": "private, no-cache",
    },
  });
}
