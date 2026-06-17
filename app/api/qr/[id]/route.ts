import { NextResponse } from "next/server";
import QRCode from "qrcode";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NextResponse("Not found", { status: 404 });

  const url = `${SITE_URL}/ticket/${id}`;
  const buffer = await QRCode.toBuffer(url, {
    width: 400,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
