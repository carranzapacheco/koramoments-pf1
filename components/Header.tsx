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
    "https://wa.me/51914824316?text=Hola%2C%20tengo%20una%20duda%20sobre%20mi%20sitio%20web."

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const linkHover = {
    scale: 1.05,
    color: "#C2A46D",
    transition: { duration: 0.25 }
  }

  const ctaHover = {
    scale: 1.03,
    backgroundColor: "#C2A46D",
    transition: { duration: 0.25 }
  }

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Ayuda", href: "/ayuda" },
  ]

  return (
    <>
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        {/* Barra superior */}
        <div
          className={`px-6 md:px-10 ${
            scrolled ? "py-3" : "py-5"
          } bg-[#EFE7DD]/95 backdrop-blur-md flex items-center justify-between border-b border-[#C2A46D]/15 transition-all duration-300`}
        >
          <motion.h1
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`font-serif tracking-wide text-[#2E2E2E] transition-all duration-300 ${
              scrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            }`}
          >
            <span className="text-[#C48B9F]">Kora</span>{" "}
            <span className="text-[#2E2E2E]">Memories</span>
          </motion.h1>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.div key={link.href} whileHover={linkHover}>
                <Link
                  href={link.href}
                  className="text-[#2E2E2E] text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <motion.div whileHover={ctaHover}>
              <Link
                href="/login"
                className="bg-[#C48B9F] text-white px-5 py-2 rounded-xl shadow-sm font-medium transition-all duration-300"
              >
                Iniciar sesión
              </Link>
            </motion.div>
          </nav>

          {/* Botón móvil */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#2E2E2E]"
          >
            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#EFE7DD] border-b border-[#C2A46D] px-6 py-5 flex flex-col gap-4 shadow-sm text-center"
          >
            {navLinks.map((link) => (
              <motion.div key={link.href} whileHover={linkHover}>
                <Link
                  href={link.href}
                  className="text-[#2E2E2E] font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <motion.div whileHover={ctaHover}>
              <Link
                href="/login"
                className="inline-block bg-[#C48B9F] text-white px-5 py-2 rounded-xl font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* WhatsApp */}
        <div className="fixed bottom-6 right-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="flex items-center justify-center p-3 rounded-full bg-[#C48B9F] text-white shadow-lg hover:bg-[#C2A46D] hover:scale-105 transition-all duration-300"
          >
            <MessageCircle size={24} />
          </a>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[90px] md:h-[96px]" />
    </>
  )
}