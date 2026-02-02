"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Info, Camera, Video, MessageCircle } from "lucide-react";

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

  const whatsappUrl =
    "https://wa.me/51914824316?text=Hola%2C%20tengo%20una%20duda%20sobre%20mi%20sitio%20web..";

  return (
    <div className="max-w-4xl md:max-w-6xl mx-auto bg-[#F5F1EC] rounded-b-2xl overflow-hidden shadow-md">
      {/* Portada */}
      <div className="relative">
        <div className="h-64 md:h-80 overflow-hidden">
          <img
            src={profileData.coverImg}
            alt="Portada conmemorativa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2E2E2E]/15" />
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-14 left-6 md:left-12">
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-[#F5F1EC] overflow-hidden shadow-md">
            <img
              src={profileData.avatarImg}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="pt-16 pb-6 px-8 md:px-12 border-b border-[#C48B9F]/30">
        <h1 className="text-3xl md:text-4xl font-serif text-[#2E2E2E] tracking-wide">
          {profileData.name}
        </h1>

        <div className="flex items-center gap-1 text-sm text-[#2E2E2E]/70 mt-2">
          <Info size={14} />
          <span>{profileData.views}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 bg-[#F5F1EC]">
        {tabs.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center py-5 transition-colors
                border-t border-[#C48B9F]/30
                ${
                  isActive
                    ? "text-[#C48B9F] border-b-2 border-[#C2A46D]"
                    : "text-[#2E2E2E]/70"
                }
                hover:bg-[#C48B9F]/10`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
