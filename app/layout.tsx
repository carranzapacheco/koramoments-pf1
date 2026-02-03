// app/layout.tsx
import { Footer } from "@/components/Footer";
import "./globals.css"
import {Header} from "@/components/Header";

export const metadata = {
  title: "Julio Steffano Vasquez Moya",
  description: "Perfil 1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
