import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔥 DELETE CLOUDINARY ROUTE HIT");
    console.log("📦 BODY:", body);

    const { public_id, resource_type } = body;

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ DELETE ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
