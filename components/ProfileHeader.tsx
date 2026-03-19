"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Info, Camera, Video } from "lucide-react";

export const ProfileHeader = () => {
  const pathname = usePathname();

  const profileData = {
    name: "Julio Steffano Vasquez Moya",
    views: "Recordado con cariño por familiares y amigos",
    coverImg: "/profiles/steffano-moya/portada.jpeg",
    avatarImg: "/profiles/steffano-moya/perfil.jpeg",
  };

  const tabs = [
    { label: "Información", href: "/perfil/informacion", icon: Info },
    { label: "Fotos", href: "/perfil/fotos", icon: Camera },
    { label: "Videos", href: "/perfil/videos", icon: Video },
    { label: "Comentarios", href: "/perfil/comentarios", icon: Heart },
  ];

  return (
    <div className="max-w-4xl md:max-w-6xl mx-auto bg-[#F5F1EC] rounded-2xl overflow-hidden shadow-md border border-[#C2A46D]/10">

      {/* Portada */}
      <div className="relative">
        <div className="h-64 md:h-80 overflow-hidden">
          <img
            src={profileData.coverImg}
            alt="Portada conmemorativa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2E2E2E]/20 to-transparent" />
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-16 left-6 md:left-10">
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-[5px] border-[#F5F1EC] overflow-hidden shadow-lg">
            <img
              src={profileData.avatarImg}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="pt-20 pb-8 px-6 md:px-10 border-b border-[#C48B9F]/20">
        <h1 className="text-2xl md:text-4xl font-serif text-[#2E2E2E] tracking-wide leading-tight">
          {profileData.name}
        </h1>

        <div className="flex items-center gap-2 text-sm text-[#1F1F1F]/70 mt-3">
          <Info size={15} className="text-[#C48B9F]" />
          <span>{profileData.views}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 bg-[#EFE7DD]">
        {tabs.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center py-4 transition-all duration-300
                ${
                  isActive
                    ? "text-[#C48B9F] border-b-2 border-[#C2A46D] bg-white/40"
                    : "text-[#2E2E2E]/70"
                }
                hover:bg-[#C48B9F]/8`}
            >
              <Icon size={18} />
              <span className="text-xs md:text-sm mt-1 font-medium">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};