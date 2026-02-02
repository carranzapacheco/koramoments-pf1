import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function borrarCarpeta(folder: string) {
  let nextCursor: string | undefined = undefined;

  do {
    const response = await cloudinary.api.resources({
      type: "upload",
      prefix: folder + "/",
      max_results: 500,
      next_cursor: nextCursor,
    });

    for (const r of response.resources) {
      await cloudinary.uploader.destroy(r.public_id, {
        resource_type: r.resource_type,
      });
      console.log("Eliminado:", r.public_id);
    }

    nextCursor = response.next_cursor;
  } while (nextCursor);
}

export async function POST() {
  try {
    await borrarCarpeta("kora/photos");
    await borrarCarpeta("kora/videos");

    return NextResponse.json({
      ok: true,
      message: "Carpetas kora/photos y kora/videos limpiadas",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error limpiando Cloudinary" },
      { status: 500 }
    );
  }
}
