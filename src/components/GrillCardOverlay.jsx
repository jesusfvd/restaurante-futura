/**
 * GrillCardOverlay.jsx
 * Animación de parrilla cerrándose sobre las cards de producto
 * Se activa al agregar un producto al carrito
 */

import { useState, useEffect } from 'react';
import './GrillCardOverlay.css';

export default function GrillCardOverlay({ isAnimating, onComplete }) {
  const [phase, setPhase] = useState('idle'); // idle | closing | check | opening
  
  useEffect(() => {
    if (!isAnimating) return;
    
    let timer1, timer2, timer3;
    
    // Fase 1: Cerrar parrilla (0-250ms)
    setPhase('closing');
    
    // Fase 2: Mostrar check (250ms)
    timer1 = setTimeout(() => {
      setPhase('check');
    }, 250);
    
    // Fase 3: Abrir parrilla (250-500ms)
    timer2 = setTimeout(() => {
      setPhase('opening');
    }, 450);
    
    // Completar animación (500ms)
    timer3 = setTimeout(() => {
      setPhase('idle');
      onComplete?.();
    }, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isAnimating, onComplete]);
  
  // No renderizar si no está animando
  if (!isAnimating && phase === 'idle') return null;
  
  // Respetar reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion && isAnimating) {
    // Completar inmediatamente sin animación
    setTimeout(() => onComplete?.(), 0);
    return null;
  }
  
  return (
    <div className={`grill-card-overlay ${phase}`}>
      {/* Barras de parrilla */}
      <div className="grill-card-bars-top">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="grill-card-bar" />
        ))}
      </div>
      
      <div className="grill-card-bars-bottom">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="grill-card-bar" />
        ))}
      </div>
      
      {/* Check icon */}
      {phase === 'check' && (
        <div className="grill-card-check">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17L4 12"
              stroke="#D4AC0D"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}