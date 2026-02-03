export async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "video"
) {
  const base64 = await fileToBase64(file);

  const res = await fetch("/api/cloudinary/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: base64,
      folder:
        resourceType === "image"
          ? "kora/photos"
          : "kora/videos",
      resource_type: resourceType,
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();

  return {
    url: data.url,
    public_id: data.public_id,
    bytes: data.bytes,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
