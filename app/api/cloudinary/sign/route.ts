import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "Missing Cloudinary env vars. Required: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
      },
      { status: 500 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "rentsmiths/gallery";

  // Signature is sha1 of: folder=...&timestamp=...<api_secret>
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}
