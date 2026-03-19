"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Profile = {
  biography?: string;
};

const PROFILE_ID = "public";

export default function Informacion() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="max-w-4xl md:max-w-6xl mx-auto px-8 md:px-12 py-10 animate-pulse">
        <div className="h-6 w-40 bg-[#C48B9F]/20 rounded mb-5" />
        <div className="space-y-3">
          <div className="h-4 bg-[#2E2E2E]/10 rounded" />
          <div className="h-4 bg-[#2E2E2E]/10 rounded" />
          <div className="h-4 bg-[#2E2E2E]/10 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="text-center text-[#2E2E2E]/70 py-10">
        Perfil no encontrado
      </p>
    );
  }

  return (
    <div
      className="
        max-w-4xl md:max-w-6xl
        mx-auto
        px-8 md:px-12
        py-8 md:py-10
        bg-white
        rounded-2xl
        shadow-md
        border
        mt-6
        mb-20 md:mb-10
      "
      style={{
        borderColor: "rgba(194,164,109,0.12)",
      }}
    >
      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <span className="h-[2px] w-8 bg-[#C2A46D] rounded-full" />

        <h2 className="text-2xl md:text-3xl font-serif text-[#2E2E2E]">
          Biografía
        </h2>
      </div>

      {/* Texto */}
      <p className="text-[#2E2E2E]/80 leading-8 whitespace-pre-line text-base md:text-lg">
        {profile.biography || "No hay información disponible."}
      </p>

      <p className="mt-8 italic text-[#C48B9F] text-center">
        "El recuerdo permanece donde el amor nunca termina."
      </p>
    </div>
  );
}