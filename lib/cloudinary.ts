export async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "video"
) {
  const formData = new FormData();

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // carpetas
  formData.append(
    "folder",
    resourceType === "image"
      ? "kora/photos"
      : "kora/videos"
  );

  // límite por archivo
  formData.append(
    "max_file_size",
    resourceType === "image"
      ? "10485760" // 10 MB
      : "209715200" // 200 MB
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();

  return {
    url: data.secure_url,
    public_id: data.public_id,
    bytes: data.bytes,
  };
}
