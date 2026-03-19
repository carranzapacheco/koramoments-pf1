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
import { Link as LinkIcon, X } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

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
  onOpen: () => void;
};

const CommentPost = ({
  name,
  message,
  timestamp,
  onOpen,
}: CommentPostProps) => {
  return (
    <div
      onClick={onOpen}
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
        cursor-pointer
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
            <span className="font-semibold text-base">{name}</span>
            <span className="text-sm italic text-[#C2A46D]">dejó un recuerdo</span>
          </div>

          {timestamp && (
            <div className="flex items-center text-xs mt-1 opacity-70">
              <span>{timestamp}</span>
              <LinkIcon size={12} className="ml-1 rotate-45" />
            </div>
          )}
        </div>
      </div>

      {/* Mensaje */}
      <div className="px-10 pb-8 text-center">
        <p
          className="
            text-lg
            leading-relaxed
            italic
            whitespace-pre-line
            line-clamp-3
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
        Kora Memories
      </div>
    </div>
  );
};

/* ---------- PAGE ---------- */

export default function Comentarios() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

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

  if (loading) return <p className="p-8">Cargando…</p>;
  if (!profile) return <p className="p-8">Perfil no encontrado</p>;

  return (
    <main className="px-4 md:px-10 py-10 min-h-screen bg-[#F5F1EC]">
      <div className="space-y-16">
        {comments.map((c) => {
          const date = c.createdAt
            ? new Date(c.createdAt.seconds * 1000).toLocaleString("es-PE", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : undefined;

          return (
            <ScrollReveal key={c.id} className="mb-16">
              <CommentPost
                name={c.name}
                message={c.message}
                timestamp={date}
                onOpen={() => setSelectedComment(c)}
              />
            </ScrollReveal>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedComment && (
        <div
          className="
            fixed inset-0 z-50
            bg-black/70
            backdrop-blur-sm
            flex items-center justify-center
            p-4
          "
          onClick={() => setSelectedComment(null)}
        >
          <div
            className="
              bg-white
              rounded-2xl
              max-w-3xl
              w-full
              shadow-2xl
              relative
              p-8 md:p-10
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* cerrar */}
            <button
              onClick={() => setSelectedComment(null)}
              className="
                absolute top-4 right-4
                bg-white/90
                rounded-full p-2
              "
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-semibold text-[#2E2E2E] mb-4 text-center">
              {selectedComment.name}
            </h3>

            <p className="text-[#C48B9F] italic text-lg leading-relaxed whitespace-pre-line text-center">
              “{selectedComment.message}”
            </p>

            {selectedComment.createdAt && (
              <p className="text-sm text-[#1F1F1F]/50 text-center mt-6">
                {new Date(
                  selectedComment.createdAt.seconds * 1000
                ).toLocaleString("es-PE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}