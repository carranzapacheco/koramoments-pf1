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

  if (loading)
    return (
      <div className="max-w-4xl md:max-w-6xl mx-auto px-8 md:px-12 py-10 animate-pulse">
        <div className="h-6 w-40 bg-[#C48B9F]/30 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-[#2E2E2E]/10 rounded" />
          <div className="h-4 bg-[#2E2E2E]/10 rounded" />
          <div className="h-4 bg-[#2E2E2E]/10 rounded w-2/3" />
        </div>
      </div>
    );

  if (!profile)
    return (
      <p className="text-center text-[#2E2E2E]/70 py-10">
        Perfil no encontrado
      </p>
    );

  return (
    <div
      className="max-w-4xl md:max-w-6xl mx-auto px-8 md:px-12 py-5 bg-[#F5F1EC] rounded-2xl shadow-md mt-6 mb-20 md:mb-8 animate-fade-in-up">
      <h2 className="text-2xl md:text-3xl font-serif text-[#2E2E2E] mb-4 flex items-center gap-2">
        <span className="h-1 w-6 bg-[#C2A46D] rounded-full" />
        Biografía
      </h2>

      <p className="text-[#2E2E2E]/80 leading-relaxed whitespace-pre-line text-base md:text-lg">
        {profile.biography || "No hay información disponible."}
      </p>
    </div>
  );
}


