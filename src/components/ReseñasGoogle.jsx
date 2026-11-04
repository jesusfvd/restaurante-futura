import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/search/?api=1&query=Compadrito+Pollos+9750+Woodman+Ave+Panorama+City+CA+91402';

export default function ReseñasGoogle() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#FCF8F0' }}>
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-4xl mx-auto text-center py-12 md:py-24"
      >
        <div className="flex justify-center gap-1 mb-6" aria-hidden="true">
          {[...Array(5)].map((_, index) => (
            <Star key={index} size={22} fill="#D4AC0D" stroke="#D4AC0D" />
          ))}
        </div>
        <p className="text-xs text-[#C0392B] uppercase tracking-[0.3em] mb-3">
          Opiniones de nuestros clientes
        </p>
        <h1
          className="text-4xl md:text-6xl font-black text-[#1A0A00] mb-5"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          El sabor se comparte
        </h1>
        <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-9" style={{ color: '#7A5A40' }}>
          Aún no publicamos reseñas en esta página. Consulta las opiniones actuales y comparte tu experiencia en Google.
        </p>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#1A0A00] text-white font-semibold hover:bg-[#C0392B] focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:ring-offset-2 transition-colors"
        >
          Ver reseñas en Google
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </motion.main>
    </div>
  );
}