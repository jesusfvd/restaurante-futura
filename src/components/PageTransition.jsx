/**
 * PageTransition.jsx
 * Transición suave y optimizada entre páginas
 * Fade out + Slide up elegante
 */

import { useState, useEffect } from 'react';
import './PageTransition.css';

export default function PageTransition({ isActive, onComplete }) {
  const [phase, setPhase] = useState('idle');
  
  useEffect(() => {
    if (!isActive) return;
    
    let timer;
    
    // Iniciar transición
    setPhase('transitioning');
    
    // Completar y navegar (400ms - rápido y fluido)
    timer = setTimeout(() => {
      onComplete?.();
      setPhase('idle');
    }, 400);
    
    return () => clearTimeout(timer);
  }, [isActive, onComplete]);
  
  if (!isActive && phase === 'idle') return null;
  
  // Respetar reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion && isActive) {
    setTimeout(() => onComplete?.(), 0);
    return null;
  }
  
  return (
    <div className={`page-transition ${phase}`}>
      <div className="page-transition-overlay" />
      <div className="page-transition-content">
        <div className="transition-icon">🍗</div>
        <p className="transition-text">Cargando menú...</p>
      </div>
    </div>
  );
}
