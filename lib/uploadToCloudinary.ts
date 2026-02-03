export const uploadToCloudinary = async (
  file: File,
  resourceType: "image" | "video"
) => {
  const base64 = await toBase64(file);

  const res = await fetch("/api/cloudinary/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: base64,
      folder: "kora/photos",
      resource_type: resourceType,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error subiendo archivo");
  }

  return await res.json();
};

// 🔁 Helper base64
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
