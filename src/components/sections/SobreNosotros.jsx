import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function SobreNosotros({ features }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      {/* Fondo: rectángulo de color en la mitad izquierda — toque editorial */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #FDF6EE, transparent)' }}
      />

      {/* Textura de papel muy sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(180,100,30,0.05) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Mancha de color — terracota arriba a la derecha */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(192,57,43,0.06) 0%, transparent 65%)', filter: 'blur(50px)' }}
      />

      {/* Mancha dorada abajo a la izquierda */}
      <div
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,172,13,0.08) 0%, transparent 65%)', filter: 'blur(50px)' }}
      />

      {/* Línea superior */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(192,57,43,0.2) 50%, transparent 90%)' }}
      />

      {/* Línea inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #C0392B 30%, #D4AC0D 50%, #C0392B 70%, transparent)' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header — layout asimétrico */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
          <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <motion.p
              initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.1 }}
              className="text-xs uppercase tracking-[0.45em] mb-3 font-bold"
              style={{ color: '#C0392B' }}
            >
              ✦ Por qué elegirnos ✦
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }}
              className="text-5xl md:text-6xl font-black leading-tight"
              style={{ fontFamily: "'Georgia', serif", color: '#1A0A00' }}
            >
              Tradición y<br />
              <span style={{ color: '#C0392B' }}>calidad</span>
            </motion.h2>
          </motion.div>

          {/* Línea decorativa lateral */}
          <motion.div
            initial={{ scaleY: 0 }} animate={isInView ? { scaleY: 1 } : {}} transition={{ delay: 0.5, duration: 0.7 }}
            className="hidden md:block w-px h-24 origin-top"
            style={{ background: 'linear-gradient(to bottom, #C0392B, #D4AC0D)' }}
          />

          <motion.p
            initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.35 }}
            className="md:max-w-xs text-base leading-relaxed"
            style={{ color: '#7A5A40' }}
          >
            Más de 40 años llevando el auténtico sabor de Sinaloa a cada mesa. Cada pollo asado es una promesa de calidad.
          </motion.p>
        </div>

        {/* Features — cards con diseño premium claro */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={i + 1}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div
                className="relative p-8 rounded-2xl h-full overflow-hidden transition-all duration-300"
                style={{
                  background: i === 1
                    ? 'linear-gradient(135deg, #C0392B 0%, #922B1E 100%)'
                    : '#FAFAF8',
                  border: i === 1 ? 'none' : '1px solid rgba(180,100,30,0.12)',
                  boxShadow: i === 1
                    ? '0 20px 60px rgba(192,57,43,0.25)'
                    : '0 4px 24px rgba(0,0,0,0.05)',
                }}
              >
                {/* Card central destacada — patrón interior */}
                {i === 1 && (
                  <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                  }} />
                )}

                {/* Número de fondo decorativo */}
                <div
                  className="absolute top-4 right-6 text-8xl font-black pointer-events-none select-none"
                  style={{ color: i === 1 ? 'rgba(255,255,255,0.08)' : 'rgba(192,57,43,0.06)', lineHeight: 1, fontFamily: "'Georgia', serif" }}
                >
                  {i + 1}
                </div>

                {/* Ícono */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: i === 1 ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, rgba(192,57,43,0.1), rgba(212,172,13,0.1))',
                    color: i === 1 ? 'white' : '#C0392B',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>

                <h3
                  className="text-xl font-black mb-3"
                  style={{ color: i === 1 ? 'white' : '#1A0A00' }}
                >
                  {feature.title}
                </h3>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: i === 1 ? 'rgba(255,255,255,0.75)' : '#7A5A40' }}
                >
                  {feature.description}
                </p>

                {/* Línea inferior decorativa (solo cards claras) */}
                {i !== 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                    style={{ background: 'linear-gradient(90deg, #C0392B, #D4AC0D, transparent)' }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}