import { ProfileHeader } from "@/components/ProfileHeader";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ProfileHeader />
      <div className="max-w-6xl mx-auto pt-6">
        {children}
      </div>
    </section>
  );
}
