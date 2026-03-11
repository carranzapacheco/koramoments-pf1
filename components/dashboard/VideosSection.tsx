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
  videos: MediaItem[];
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  videoDescription: string;
  setVideoDescription: (v: string) => void;
  handleUpload: (type: "videos", file: File | null) => void;
  updateMediaDescription: (
    type: "videos",
    item: MediaItem,
    description: string
  ) => void;
  handleDelete: (type: "videos", item: MediaItem) => void;
  loading: boolean;
  storageFull: boolean;
  editingDescriptions: Record<string, string>;
  setEditingDescriptions: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  videoDescMax: number;
};

export default function VideosSection({
  videos,
  videoFile,
  setVideoFile,
  videoDescription,
  setVideoDescription,
  handleUpload,
  updateMediaDescription,
  handleDelete,
  loading,
  storageFull,
  editingDescriptions,
  setEditingDescriptions,
  videoDescMax,
}: Props) {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const sortedVideos = useMemo(() => {
    return [...videos].sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  }, [videos]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const perView = isMobile ? 1 : 2;
  const totalSlides = Math.ceil(sortedVideos.length / perView);

  useEffect(() => {
    setIndex(0);
  }, [sortedVideos.length, perView]);

  const visibleItems = sortedVideos.slice(
    index * perView,
    index * perView + perView
  );

  const handleFileChange = (file: File | null) => {
    setVideoFile(file);

    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleUploadClick = () => {
    handleUpload("videos", videoFile);

    setVideoFile(null);
    setPreview(null);
    setVideoDescription("");
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">Videos</h2>

      <div className="border-2 border-dashed border-[#C48B9F] rounded-xl p-6 text-center bg-gray-50">

        <label className="cursor-pointer block">
          <span className="text-[#C48B9F] font-medium">
            Seleccionar video
          </span>

          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) =>
              handleFileChange(e.target.files?.[0] || null)
            }
          />
        </label>

        {videoFile && (
          <p className="text-xs text-gray-500 mt-2">
            Peso: {(videoFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}

        {preview && (
          <div className="mt-4 max-w-md mx-auto aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={preview}
              controls
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <textarea
          value={videoDescription}
          onChange={(e) =>
            setVideoDescription(e.target.value.slice(0, videoDescMax))
          }
          placeholder="Descripción del video"
          className="w-full border rounded-lg p-3 mt-4"
        />

        <button
          disabled={loading || storageFull}
          onClick={handleUploadClick}
          className="bg-[#C48B9F] text-white px-6 py-2 rounded-lg mt-3"
        >
          Subir Video
        </button>
      </div>

      {sortedVideos.length > 0 && (
        <div className="mt-10">

          <div className="flex gap-6">
            {visibleItems.map((video) => (
              <div
                key={video.public_id}
                className={`${isMobile ? "w-full" : "w-1/2"} border rounded-xl p-4 bg-gray-50`}
              >
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>

                <textarea
                  value={
                    editingDescriptions[video.public_id] ??
                    video.description ??
                    ""
                  }
                  onChange={(e) =>
                    setEditingDescriptions((prev) => ({
                      ...prev,
                      [video.public_id]: e.target.value,
                    }))
                  }
                  className="w-full mt-3 border rounded-lg p-2 text-sm"
                />

                <div className="flex justify-between mt-3 text-sm">
                  <button
                    onClick={() =>
                      updateMediaDescription(
                        "videos",
                        video,
                        editingDescriptions[video.public_id] ??
                          video.description ??
                          ""
                      )
                    }
                    className="text-green-600"
                  >
                    Guardar
                  </button>

                  <button
                    onClick={() => handleDelete("videos", video)}
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
                onClick={() => setIndex((prev) => prev - 1)}
                disabled={index === 0}
                className="bg-gray-100 px-4 py-2 rounded-lg shadow"
              >
                ◀
              </button>

              <button
                onClick={() => setIndex((prev) => prev + 1)}
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