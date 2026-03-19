"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { Link as LinkIcon, X } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

/* ---------- TIPOS ---------- */

type MediaItem = {
  url: string;
  public_id: string;
  bytes: number;
  description?: string;
  createdAt?: Timestamp;
};

type Profile = {
  biography?: string;
  videos?: MediaItem[];
};

type TimelineItem = {
  createdAt: Timestamp;
  data: MediaItem;
};

const PROFILE_ID = "public";
const AUTHOR_NAME = "Julio Steffano Vasquez Moya";

/* ---------- COMPONENTE POST VIDEO ---------- */

type VideoPostProps = {
  timestamp: string;
  content: string;
  videoUrl: string;
  onOpen: () => void;
};

const VideoPost = ({
  timestamp,
  content,
  videoUrl,
  onOpen,
}: VideoPostProps) => {
  return (
    <div
      className="
        w-full
        max-w-4xl
        mx-auto
        rounded-2xl
        border
        shadow-lg
        transition-all
        duration-700
        ease-out
        hover:shadow-xl
        hover:-translate-y-1
      "
      style={{
        backgroundColor: "#F5F1EC",
        borderColor: "#C2A46D",
        color: "#2E2E2E",
      }}
    >
      {/* Header */}
      <div className="flex items-start p-6 space-x-4">
        <div
          className="w-14 h-14 rounded-full overflow-hidden border flex-shrink-0"
          style={{ borderColor: "#C2A46D" }}
        >
          <img
            src="/profiles/steffano-moya/perfil.jpeg"
            alt={AUTHOR_NAME}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center flex-wrap gap-x-2">
            <span className="font-semibold text-base">{AUTHOR_NAME}</span>
            <span className="text-sm italic text-[#C2A46D]">compartió un video</span>
          </div>

          <div className="flex items-center text-xs mt-1 opacity-70">
            <span>{timestamp}</span>
            <LinkIcon size={12} className="ml-1 rotate-45" />
          </div>
        </div>
      </div>

      {/* Descripción */}
      {content && (
        <div className="px-6 md:px-8 pb-6">
          <p
            className="text-lg italic leading-relaxed"
            style={{ color: "#C48B9F" }}
          >
            “{content}”
          </p>
        </div>
      )}

      {/* Video clickable */}
      <div
        className="w-full bg-black flex justify-center overflow-hidden cursor-pointer"
        onClick={onOpen}
      >
        <video
          src={videoUrl}
          controls
          preload="metadata"
          className="
            max-h-[370px]
            w-full
            object-contain
            transition-transform
            duration-700
            ease-out
            hover:scale-[1.01]
          "
        />
      </div>

      {/* Footer */}
      <div
        className="p-4 text-center text-xs opacity-60"
        style={{ borderTop: "1px solid #C2A46D" }}
      >
        Kora Memories
      </div>
    </div>
  );
};

/* ---------- PAGE ---------- */

export default function Videos() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const ref = doc(db, "profiles", PROFILE_ID);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data() as Profile);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const timeline = useMemo<TimelineItem[]>(() => {
    if (!profile?.videos) return [];

    return profile.videos
      .filter((video) => video.createdAt)
      .map((video) => ({ createdAt: video.createdAt!, data: video }))
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  }, [profile]);

  if (loading) return <p className="p-8">Cargando…</p>;
  if (!profile) return <p className="p-8">Perfil no encontrado</p>;

  return (
    <main className="px-4 md:px-10 py-10 min-h-screen bg-[#F5F1EC]">
      <div className="space-y-16">
        {timeline.map((item, index) => {
          const date = item.createdAt.toDate().toLocaleString("es-PE", {
            dateStyle: "medium",
            timeStyle: "short",
          });

          return (
            <ScrollReveal key={index} className="mb-16">
              <VideoPost
                timestamp={date}
                content={item.data.description || ""}
                videoUrl={item.data.url}
                onOpen={() => setSelectedVideo(item.data)}
              />
            </ScrollReveal>
          );
        })}
      </div>

      {/* MODAL VIDEO */}
      {selectedVideo && (
        <div
          className="
            fixed inset-0 z-50
            bg-black/75
            backdrop-blur-sm
            flex items-center justify-center
            p-4
          "
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="
              bg-white
              rounded-2xl
              max-w-5xl
              w-full
              overflow-hidden
              shadow-2xl
              relative
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* cerrar */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="
                absolute top-4 right-4 z-10
                bg-white/90
                rounded-full p-2
                hover:bg-white
              "
            >
              <X size={18} />
            </button>

            {/* video */}
            <div className="bg-black flex justify-center">
              <video
                src={selectedVideo.url}
                controls
                autoPlay
                className="max-h-[80vh] w-full object-contain"
              />
            </div>

            {/* descripción */}
            {selectedVideo.description && (
              <div className="p-6 text-center">
                <p className="italic text-[#C48B9F] text-lg">
                  “{selectedVideo.description}”
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}