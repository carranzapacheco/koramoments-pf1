"use client";

import { useState, useEffect, useMemo } from "react";
import { Timestamp } from "firebase/firestore";

type MediaItem = {
  url: string;
  public_id: string;
  bytes: number;
  description?: string;
  createdAt: Timestamp;
};

type Props = {
  photos: MediaItem[];
  photoFile: File | null;
  setPhotoFile: (file: File | null) => void;
  photoDescription: string;
  setPhotoDescription: (v: string) => void;
  handleUpload: (type: "photos", file: File | null) => void;
  updateMediaDescription: (
    type: "photos",
    item: MediaItem,
    description: string
  ) => void;
  handleDelete: (type: "photos", item: MediaItem) => void;
  loading: boolean;
  storageFull: boolean;
  editingDescriptions: Record<string, string>;
  setEditingDescriptions: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  photoDescMax: number;
};

export default function PhotosSection({
  photos,
  photoFile,
  setPhotoFile,
  photoDescription,
  setPhotoDescription,
  handleUpload,
  updateMediaDescription,
  handleDelete,
  loading,
  storageFull,
  editingDescriptions,
  setEditingDescriptions,
  photoDescMax,
}: Props) {

  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const sortedPhotos = useMemo(() => {
    return [...photos].sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  }, [photos]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleResize = () => setIsMobile(mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () =>
      mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const perView = isMobile ? 1 : 2;

  const totalSlides = Math.ceil(sortedPhotos.length / perView);

  useEffect(() => {
    setIndex(0);
  }, [sortedPhotos.length, perView]);

  const visibleItems = sortedPhotos.slice(
    index * perView,
    index * perView + perView
  );

  const handleFileChange = (file: File | null) => {

    setPhotoFile(file);

    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleUploadClick = () => {

    handleUpload("photos", photoFile);

    setPhotoFile(null);
    setPreview(null);
    setPhotoDescription("");
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">

      <h2 className="text-xl font-semibold mb-6">
        Fotos
      </h2>

      {/* Upload */}

      <div className="border-2 border-dashed border-[#C48B9F] rounded-xl p-6 text-center bg-gray-50">

        <label className="cursor-pointer block">

          <span className="text-[#C48B9F] font-medium">
            Seleccionar foto
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleFileChange(e.target.files?.[0] || null)
            }
          />

        </label>

        {photoFile && (

          <p className="text-xs text-gray-500 mt-2">
            Peso: {(photoFile.size / 1024 / 1024).toFixed(2)} MB
          </p>

        )}

        {preview && (

          <div className="mt-4 w-full max-w-sm mx-auto aspect-[4/3] bg-black rounded-lg overflow-hidden">
            <img
              src={preview}
              alt=""
              className="w-full h-full object-contain"
            />

          </div>

        )}

        <textarea
          value={photoDescription}
          onChange={(e) =>
            setPhotoDescription(
              e.target.value.slice(0, photoDescMax)
            )
          }
          placeholder="Descripción de la foto"
          className="w-full border rounded-lg p-3 mt-4"
        />

        <button
          disabled={loading || storageFull}
          onClick={handleUploadClick}
          className="bg-[#C48B9F] text-white px-6 py-2 rounded-lg mt-3"
        >
          Subir Foto
        </button>

      </div>

      {/* Carousel */}

      {sortedPhotos.length > 0 && (

        <div className="mt-10">

          <div className="flex gap-6">

            {visibleItems.map((photo) => (

              <div
                key={photo.public_id}
                className={`${
                  isMobile ? "w-full" : "w-1/2"
                } border rounded-xl p-4 bg-gray-50`}
              >

                <div className="w-full aspect-[4/3] bg-black rounded-lg overflow-hidden">

                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-contain"
                  />

                </div>

                <textarea
                  value={
                    editingDescriptions[photo.public_id] ??
                    photo.description ??
                    ""
                  }
                  onChange={(e) =>
                    setEditingDescriptions((prev) => ({
                      ...prev,
                      [photo.public_id]: e.target.value,
                    }))
                  }
                  className="w-full mt-3 border rounded-lg p-2 text-sm"
                />

                <div className="flex justify-between mt-3 text-sm">

                  <button
                    onClick={() =>
                      updateMediaDescription(
                        "photos",
                        photo,
                        editingDescriptions[
                          photo.public_id
                        ] ??
                          photo.description ??
                          ""
                      )
                    }
                    className="text-green-600"
                  >
                    Guardar
                  </button>

                  <button
                    onClick={() =>
                      handleDelete("photos", photo)
                    }
                    className="text-red-600"
                  >
                    Eliminar
                  </button>

                </div>

              </div>

            ))}

          </div>

          {totalSlides > 1 && (

            <div className="flex justify-center gap-4 mt-6">

              <button
                onClick={() =>
                  setIndex((prev) => prev - 1)
                }
                disabled={index === 0}
                className="bg-gray-100 px-4 py-2 rounded-lg shadow"
              >
                ◀
              </button>

              <button
                onClick={() =>
                  setIndex((prev) => prev + 1)
                }
                disabled={index === totalSlides - 1}
                className="bg-gray-100 px-4 py-2 rounded-lg shadow"
              >
                ▶
              </button>

            </div>

          )}

        </div>

      )}

    </div>
  );
}