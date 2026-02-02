'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { HiMenu, HiX } from "react-icons/hi"
import { MessageCircle } from "lucide-react"


export const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
    const whatsappUrl =
    "https://wa.me/51914824316?text=Hola%2C%20tengo%20una%20duda%20sobre%20mi%20sitio%20web..";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const linkHover = { scale: 1.05, color: "#C2A46D", transition: { duration: 0.3 } }
  const ctaHover = { scale: 1.05, backgroundColor: "#C2A46D", transition: { duration: 0.3 } }

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Ayuda", href: "/ayuda" },
  ]

  return (
    <>
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-300
        ${scrolled ? "shadow-lg" : ""}`}
      >

        {/* Barra superior */}
        <div
          className={`px-6 md:px-8
          ${scrolled ? "py-3 md:py-4" : "py-5 md:py-6"}
          bg-gradient-to-r from-[#F5F1EC] to-[#EFE7DD]
          backdrop-blur-md flex items-center justify-between
          transition-all duration-300`}
        >

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`font-serif tracking-wide
              text-[#2E2E2E] transition-all duration-300
              ${scrolled ? "text-xl md:text-3xl" : "text-2xl md:text-4xl"}`}
          >
            <span className="text-[#C2A46D]">Kora</span> Memories
          </motion.h1>

          {/* Botón hamburguesa móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#2E2E2E]"
            >
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Navegación Escritorio */}
        <nav
          className={`hidden md:block
          bg-[#E0D8C5]/95 backdrop-blur-sm
          border-t border-[#C2A46D]/30 px-8
          ${scrolled ? "py-2" : "py-3"}
          transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.li key={link.href} whileHover={linkHover}>
                  <Link
                    href={link.href}
                    className="text-sm md:text-base font-medium
                               text-[#2E2E2E]/80 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div whileHover={ctaHover}>
              <Link
                href="/login"
                className="text-sm md:text-base font-semibold
                           text-white bg-[#C48B9F]
                           px-5 py-2 rounded-lg shadow-md
                           transition-all duration-300"
              >
                Iniciar sesión
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Línea dorada divisoria */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C2A46D]/60 to-transparent" />

        {/* Navegación Móvil */}
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden
                       bg-[#F5F1EC]/98 backdrop-blur-md
                       border-t border-[#C2A46D]/30
                       px-6 py-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <motion.div key={link.href} whileHover={linkHover}>
                <Link
                  href={link.href}
                  className="text-base font-medium text-[#2E2E2E]/80"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <motion.div whileHover={ctaHover}>
              <Link
                href="/login"
                className="text-base font-semibold
                           text-white bg-[#C48B9F]
                           px-5 py-2 rounded-lg shadow-md"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            </motion.div>
          </motion.nav>
        )}

        {/* Botón flotante WhatsApp */}
      <div className="fixed bottom-6 right-6">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="flex items-center justify-center p-3 rounded-full
                     bg-[#25D366] text-white shadow-lg
                     hover:scale-105 transition-transform"
        >
          <MessageCircle size={26} />
        </a>
      </div>
      </header>

      {/* Spacer */}
      <div className="h-[128px] md:h-[160px]"></div>
    </>
  )
}
