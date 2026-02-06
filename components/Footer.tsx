'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

export const Footer: React.FC = () => {
  const socialVariants = {
    hover: { scale: 1.2, color: '#C2A46D', transition: { duration: 0.3 } },
  }

  const linkVariants = {
    hover: { scale: 1.05, color: '#C48B9F', transition: { duration: 0.3 } },
  }

  return (
    <footer className="bg-[#E0D8C5] text-[#2E2E2E] py-8 px-6 md:px-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8 items-center md:items-start">

        {/* Logo centrado */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/Logo-full.png"
            alt="Kora Memories"
            width={400}
            height={120}
            priority
            className="mb-2 drop-shadow-xl p-2"
          />
        </div>

        {/* Contacto y redes */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6">
          <div>
            <h3 className="text-md font-bold mb-2">Contáctanos</h3>
            <ul className="space-y-1 text-sm">
              <motion.li whileHover={{ scale: 1.05 }}>
                <a
                  href="https://wa.me/51914824316"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#C48B9F] justify-center md:justify-start transition-colors"
                >
                  <FaWhatsapp size={16} /> +51 914 824 316
                </a>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <a
                  href="mailto:carranzapacheco.f.a@gmail.com"
                  className="text-[#C48B9F] transition-colors"
                >
                  carranzapacheco.f.a@gmail.com
                </a>
              </motion.li>
              <li className="text-sm">Trujillo - La Libertad, Perú</li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-bold mb-2">Síguenos</h3>
            <div className="flex justify-center md:justify-start gap-3">
              <motion.a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                variants={socialVariants}
                whileHover="hover"
                className="text-[#C48B9F]"
              >
                <FaFacebookF size={18} />
              </motion.a>

              <motion.a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                variants={socialVariants}
                whileHover="hover"
                className="text-[#C48B9F]"
              >
                <FaInstagram size={18} />
              </motion.a>

              <motion.a
                href="https://tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                variants={socialVariants}
                whileHover="hover"
                className="bg-[#C48B9F] p-1.5 rounded-md text-white"
              >
                <FaTiktok size={14} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-md font-bold mb-2">Enlaces</h3>

          <ul className="space-y-2 text-sm">
            {/* Inicio */}
            <motion.li variants={linkVariants} whileHover="hover">
              <Link href="/" className="transition-colors">
                Inicio
              </Link>
            </motion.li>

            {/* Términos y Condiciones (DESCARGA PDF) */}
            <motion.li variants={linkVariants} whileHover="hover">
              <a
                href="/terminos y condiciones.pdf"
                download
                className="transition-colors"
              >
                Términos y Condiciones
              </a>
            </motion.li>

            {/* Ayuda */}
            <motion.li variants={linkVariants} whileHover="hover">
              <Link href="/ayuda" className="transition-colors">
                Ayuda
              </Link>
            </motion.li>
          </ul>
        </div>

      </div>
    </footer>
  )
}
