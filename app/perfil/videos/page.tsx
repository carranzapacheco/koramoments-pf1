"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { Link as LinkIcon } from "lucide-react";

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
};

const VideoPost = ({ timestamp, content, videoUrl }: VideoPostProps) => {
  return (
    <div
      className="
        mx-auto
        max-w-4xl
        rounded-2xl
        border
        shadow-lg
        transition-all
        duration-700
        ease-out
        hover:shadow-xl
        hover:-translate-y-1
        animate-fadeIn
      "
      style={{
        backgroundColor: "#F5F1EC",
        borderColor: "#C2A46D",
        color: "#2E2E2E",
      }}
    >
      {/* Header */}
      <div className="flex items-start p-6 space-x-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full overflow-hidden border flex-shrink-0"
          style={{ borderColor: "#C2A46D" }}
        >
          <img
            src="/profiles/steffano-moya/perfil.jpg"
            alt={AUTHOR_NAME}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center flex-wrap gap-x-2">
            <span className="font-semibold text-base">
              {AUTHOR_NAME}
            </span>
            <span className="text-sm italic opacity-70">
              uploaded 1 video
            </span>
          </div>

          <div className="flex items-center text-xs mt-1 opacity-70">
            <span>{timestamp}</span>
            <LinkIcon size={12} className="ml-1 rotate-45" />
          </div>
        </div>
      </div>

      {/* Descripción */}
      {content && (
        <div className="px-8 pb-6">
          <p
            className="
              text-lg
              italic
              leading-relaxed
              animate-fadeUp
            "
            style={{ color: "#C48B9F" }}
          >
            “{content}”
          </p>
        </div>
      )}

      {/* Video */}
      <div className="w-full bg-black flex justify-center overflow-hidden">
        <video
          src={videoUrl}
          controls
          className="
            max-h-[640px]
            w-full
            object-contain
            transition-transform
            duration-700
            ease-out
            hover:scale-[1.01]
          "
        />
      </div>

      {/* Footer minimal */}
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

  /* ---------- PERFIL ---------- */
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

  /* ---------- TIMELINE (SOLO VIDEOS) ---------- */
  const timeline = useMemo<TimelineItem[]>(() => {
    if (!profile?.videos) return [];

    return profile.videos
      .filter((video) => video.createdAt)
      .map((video) => ({
        createdAt: video.createdAt!,
        data: video,
      }))
      .sort(
        (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
      );
  }, [profile]);

  /* ---------- GUARDS ---------- */
  if (loading) return <p className="p-8">Cargando…</p>;
  if (!profile) return <p className="p-8">Perfil no encontrado</p>;

  /* ---------- RENDER ---------- */
  return (
    <main
      className="p-10 min-h-screen"
      style={{ backgroundColor: "#F5F1EC" }}
    >
      <div className="space-y-16 max-w-6xl mx-auto">
        {timeline.map((item, index) => {
          const date = item.createdAt.toDate().toLocaleString("es-PE", {
            dateStyle: "medium",
            timeStyle: "short",
          });

          return (
            <VideoPost
              key={index}
              timestamp={date}
              content={item.data.description || ""}
              videoUrl={item.data.url}
            />
          );
        })}
      </div>
    </main>
  );
}
