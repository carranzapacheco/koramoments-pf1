"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { Link as LinkIcon } from "lucide-react";
import { ProfileHeader } from "@/components/ProfileHeader";
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
  photos?: MediaItem[];
  videos?: MediaItem[];
};

type Comment = {
  id: string;
  name: string;
  message: string;
  createdAt?: Timestamp;
};

type TimelineItem = {
  type: "photo" | "video" | "comment";
  createdAt: Timestamp;
  data: any;
};

const PROFILE_ID = "public";
const AUTHOR_NAME = "Julio Steffano Vasquez Moya";
const PROFILE_IMAGE = "/profiles/steffano-moya/perfil.jpeg";

/* ---------- HEADER POST ---------- */

const PostHeader = ({
  name,
  timestamp,
  label,
}: {
  name: string;
  timestamp?: string;
  label: string;
}) => {
  return (
    <div className="flex items-start p-6 md:p-8 space-x-4">
      <div
        className="w-14 h-14 rounded-full overflow-hidden border shadow-sm flex-shrink-0"
        style={{ borderColor: "#C2A46D" }}
      >
        <img
          src={PROFILE_IMAGE}
          alt={AUTHOR_NAME}
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <div className="flex items-center flex-wrap gap-x-2">
          <span className="font-semibold text-base text-[#2E2E2E]">{name}</span>
          <span className="text-sm italic text-[#C2A46D]">{label}</span>
        </div>

        {timestamp && (
          <div className="flex items-center text-xs mt-1 text-[#1F1F1F]/60">
            <span>{timestamp}</span>
            <LinkIcon size={12} className="ml-1 rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- CARD BASE ---------- */

const CardBase = ({ children }: { children: React.ReactNode }) => (
  <div
    className="
      mx-auto
      max-w-4xl
      rounded-2xl
      shadow-md
      transition-all
      duration-500
      hover:shadow-lg
      hover:-translate-y-1
      overflow-hidden
      border
      w-full
    "
    style={{
      backgroundColor: "#FFFFFF",
      borderColor: "rgba(194,164,109,0.15)",
      color: "#2E2E2E",
    }}
  >
    {children}
  </div>
);

/* ---------- FOTO ---------- */

const PhotoPost = ({ item, date }: { item: MediaItem; date: string }) => (
  <CardBase>
    <PostHeader
      name={AUTHOR_NAME}
      timestamp={date}
      label="compartió una fotografía"
    />

    {item.description && (
      <div className="px-8 md:px-10 mb-5">
        <p className="italic text-[#C48B9F] text-lg leading-relaxed">
          “{item.description}”
        </p>
      </div>
    )}

    <div className="w-full bg-[#F5F1EC] flex justify-center">
      <img
        src={item.url}
        alt={item.description}
        className="max-h-[420px] w-full object-contain"
      />
    </div>

    <div className="p-4 text-center text-xs text-[#1F1F1F]/50 border-t border-[#C2A46D]/10">
      📸 Kora Memories
    </div>
  </CardBase>
);

/* ---------- VIDEO ---------- */

const VideoPost = ({ item, date }: { item: MediaItem; date: string }) => (
  <CardBase>
    <PostHeader
      name={AUTHOR_NAME}
      timestamp={date}
      label="compartió un video"
    />

    {item.description && (
      <div className="px-8 md:px-10 mb-5">
        <p className="italic text-[#C48B9F] text-lg leading-relaxed">
          “{item.description}”
        </p>
      </div>
    )}

    <div className="w-full bg-[#F5F1EC] flex justify-center">
      <video
        src={item.url}
        controls
        className="max-h-[420px] w-full object-contain"
      />
    </div>

    <div className="p-4 text-center text-xs text-[#1F1F1F]/50 border-t border-[#C2A46D]/10">
      🎥 Kora Memories
    </div>
  </CardBase>
);

/* ---------- COMENTARIO ---------- */

const CommentPost = ({ item, date }: { item: Comment; date: string }) => (
  <CardBase>
    <PostHeader
      name={item.name}
      timestamp={date}
      label="dejó un recuerdo"
    />

    <div className="px-8 md:px-12 pb-8 text-center">
      <p
        className="text-lg md:text-xl leading-relaxed italic whitespace-pre-line"
        style={{ color: "#C48B9F" }}
      >
        “{item.message}”
      </p>
    </div>

    <div className="p-4 text-center text-xs text-[#1F1F1F]/50 border-t border-[#C2A46D]/10">
      Kora Memories
    </div>
  </CardBase>
);

/* ---------- PAGE ---------- */

export default function Recuerdos() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "profiles", PROFILE_ID));
      if (snap.exists()) setProfile(snap.data() as Profile);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      setComments(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, "id">),
        }))
      );
    };

    fetchComments();
  }, []);

  const timeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];

    profile?.photos?.forEach((p) => {
      if (p.createdAt) {
        items.push({
          type: "photo",
          createdAt: p.createdAt,
          data: p,
        });
      }
    });

    profile?.videos?.forEach((v) => {
      if (v.createdAt) {
        items.push({
          type: "video",
          createdAt: v.createdAt,
          data: v,
        });
      }
    });

    comments.forEach((c) => {
      if (c.createdAt) {
        items.push({
          type: "comment",
          createdAt: c.createdAt,
          data: c,
        });
      }
    });

    return items.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  }, [profile, comments]);

  if (loading) {
    return (
      <p className="p-8 text-center text-[#2E2E2E]">
        Cargando…
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="p-8 text-center text-[#2E2E2E]">
        Perfil no encontrado
      </p>
    );
  }

  return (
    <main
      className="min-h-screen overflow-y-auto"
      style={{ backgroundColor: "#F5F1EC" }}
    >
      <ProfileHeader />

      <h2 className="py-12 text-3xl md:text-4xl font-serif text-center text-[#C48B9F]">
        Memorias que llenarán nuestro corazón{" "}
        <span className="text-[#C2A46D]">♥</span>
      </h2>

      <div className="space-y-16 max-w-6xl mx-auto px-4 pb-16">
        {timeline.map((item, index) => {
          const date = item.createdAt.toDate().toLocaleString("es-PE", {
            dateStyle: "medium",
            timeStyle: "short",
          });

          if (item.type === "photo") {
            return (
              <ScrollReveal key={index}>
                <PhotoPost item={item.data} date={date} />
              </ScrollReveal>
            );
          }

          if (item.type === "video") {
            return (
              <ScrollReveal key={index}>
                <VideoPost item={item.data} date={date} />
              </ScrollReveal>
            );
          }

          if (item.type === "comment") {
            return (
              <ScrollReveal key={index}>
                <CommentPost item={item.data} date={date} />
              </ScrollReveal>
            );
          }

          return null;
        })}
      </div>
    </main>
  );
}