export const uploadVideoDirectToCloudinary = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "videos_unsigned");
  formData.append("folder", "kora/videos");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Error subiendo video a Cloudinary");
  }

  const data = await res.json();

  return {
    url: data.secure_url,
    public_id: data.public_id,
    bytes: data.bytes,
  };
};
