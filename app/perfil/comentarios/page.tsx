"use client";

import { useEffect, useState } from "react";
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

/* ---------- TIPOS ---------- */

type Comment = {
  id: string;
  name: string;
  message: string;
  createdAt?: Timestamp;
};

type Profile = {
  biography?: string;
};

const PROFILE_ID = "public";
const AUTHOR_NAME = "Julio Steffano Vasquez Moya";

/* ---------- COMPONENTE COMMENT POST ---------- */

type CommentPostProps = {
  name: string;
  message: string;
  timestamp?: string;
};

const CommentPost = ({
  name,
  message,
  timestamp,
}: CommentPostProps) => {
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
              {name}
            </span>
            <span className="text-sm italic opacity-70">
              dejó un recuerdo
            </span>
          </div>

          {timestamp && (
            <div className="flex items-center text-xs mt-1 opacity-70">
              <span>{timestamp}</span>
              <LinkIcon size={12} className="ml-1 rotate-45" />
            </div>
          )}
        </div>
      </div>

      {/* Mensaje centrado */}
      <div className="px-10 pb-8 text-center">
        <p
          className="
            text-lg
            leading-relaxed
            italic
            whitespace-pre-line
            animate-fadeUp
          "
          style={{ color: "#C48B9F" }}
        >
          “{message}”
        </p>
      </div>

      {/* Footer */}
      <div
        className="p-4 text-center text-xs opacity-60"
        style={{ borderTop: "1px solid #C2A46D" }}
      >
        Kora Moments
      </div>
    </div>
  );
};

/* ---------- PAGE ---------- */

export default function Comentarios() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
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

  /* ---------- COMENTARIOS ---------- */
  useEffect(() => {
    const fetchComments = async () => {
      const q = query(
        collection(db, "comments"),
        orderBy("createdAt", "desc")
      );

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
        {comments.map((c) => {
          const date = c.createdAt
            ? new Date(c.createdAt.seconds * 1000).toLocaleString(
                "es-PE",
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                }
              )
            : undefined;

          return (
            <CommentPost
              key={c.id}
              name={c.name}
              message={c.message}
              timestamp={date}
            />
          );
        })}
      </div>
    </main>
  );
}
