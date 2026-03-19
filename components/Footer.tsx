'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

export const Footer: React.FC = () => {
  const socialVariants = {
    hover: {
      scale: 1.15,
      color: '#C2A46D',
      transition: { duration: 0.25 }
    },
  }

  const linkVariants = {
    hover: {
      scale: 1.03,
      color: '#C2A46D',
      transition: { duration: 0.25 }
    },
  }

  return (
    <footer className="bg-[#EFE7DD] border-t border-[#C2A46D]/15 text-[#2E2E2E] py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 items-center md:items-start">

        {/* Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Image
            src="/Logo-full.png"
            alt="Kora Memories"
            width={300}
            height={90}
            priority
            className="mb-3"
          />
          <p className="text-sm text-[#1F1F1F]/70 max-w-xs leading-relaxed">
            Preservando recuerdos con amor, respeto y significado.
          </p>
        </div>

        {/* Contacto */}
        <div className="text-center md:text-left">
          <h3 className="text-[#C48B9F] font-semibold mb-3">
            Contáctanos
          </h3>

          <ul className="space-y-2 text-sm">
            <motion.li whileHover={{ scale: 1.03 }}>
              <a
                href="https://wa.me/51914824316"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center md:justify-start text-[#2E2E2E]"
              >
                <FaWhatsapp size={15} />
                +51 914 824 316
              </a>
            </motion.li>

            <motion.li whileHover={{ scale: 1.03 }}>
              <a
                href="mailto:carranzapacheco.f.a@gmail.com"
                className="text-[#2E2E2E]"
              >
                carranzapacheco.f.a@gmail.com
              </a>
            </motion.li>

            <li className="text-[#1F1F1F]/70">
              Trujillo - La Libertad, Perú
            </li>
          </ul>
        </div>

        {/* Enlaces */}
        <div className="text-center md:text-left">
          <h3 className="text-[#C48B9F] font-semibold mb-3">
            Enlaces
          </h3>

          <ul className="space-y-2 text-sm">
            <motion.li variants={linkVariants} whileHover="hover">
              <Link href="/">Inicio</Link>
            </motion.li>

            <motion.li variants={linkVariants} whileHover="hover">
              <a href="/terminos y condiciones.pdf" download>
                Términos y Condiciones
              </a>
            </motion.li>

            <motion.li variants={linkVariants} whileHover="hover">
              <Link href="/ayuda">Ayuda</Link>
            </motion.li>
          </ul>
        </div>

        {/* Redes */}
        <div className="text-center md:text-left">
          <h3 className="text-[#C48B9F] font-semibold mb-3">
            Síguenos
          </h3>

          <div className="flex gap-4 justify-center md:justify-start">
            <motion.a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              variants={socialVariants}
              whileHover="hover"
              className="text-[#2E2E2E]"
            >
              <FaFacebookF size={17} />
            </motion.a>

            <motion.a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              variants={socialVariants}
              whileHover="hover"
              className="text-[#2E2E2E]"
            >
              <FaInstagram size={17} />
            </motion.a>

            <motion.a
              href="https://tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              variants={socialVariants}
              whileHover="hover"
              className="text-[#2E2E2E]"
            >
              <FaTiktok size={16} />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-8 pt-5 border-t border-[#C2A46D]/10 text-center text-xs text-[#1F1F1F]/60">
        © 2026 Kora Memories. Todos los derechos reservados.
      </div>
    </footer>
  )
}