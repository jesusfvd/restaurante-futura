/**
 * useReseñasStore.js
 * Store global de reseñas con Zustand + persistencia en localStorage
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Reseñas iniciales de demostración
const RESEÑAS_INICIALES = [
  {
    id: 1,
    nombre: 'Carlos Mendoza',
    avatar: '',
    estrellas: 5,
    comentario: '¡El mejor pollo asado de la ciudad! La carne está jugosa y el sabor es increíble. Llevo años viniendo y nunca decepciona.',
    fecha: '15 de abril, 2026',
    likes: 24,
    liked: false,
    verificado: true,
  },
  {
    id: 2,
    nombre: 'Ana Rodríguez',
    avatar: '',
    estrellas: 5,
    comentario: 'Excelente servicio y la comida deliciosa. Las papas fritas son las mejores que he probado. Totalmente recomendado para reuniones familiares.',
    fecha: '12 de abril, 2026',
    likes: 18,
    liked: false,
    verificado: true,
  },
  {
    id: 3,
    nombre: 'Luis Fernández',
    avatar: '',
    estrellas: 4,
    comentario: 'Muy buena calidad y precio justo. El pollo está bien sazonado y las porciones son generosas. Solo mejoraría los tiempos de espera en fin de semana.',
    fecha: '10 de abril, 2026',
    likes: 12,
    liked: false,
    verificado: true,
  },
  {
    id: 4,
    nombre: 'María González',
    avatar: '',
    estrellas: 5,
    comentario: 'Tradición familiar de 40 años que se nota en cada bocado. El sabor es auténtico y el ambiente muy acogedor. ¡Volveremos pronto!',
    fecha: '8 de abril, 2026',
    likes: 31,
    liked: false,
    verificado: true,
  },
  {
    id: 5,
    nombre: 'Roberto Sánchez',
    avatar: '',
    estrellas: 5,
    comentario: 'Pedí para una fiesta familiar y todos quedaron encantados. El pollo estaba perfecto y las ensaladas muy frescas. Excelente relación calidad-precio.',
    fecha: '5 de abril, 2026',
    likes: 15,
    liked: false,
    verificado: true,
  },
  {
    id: 6,
    nombre: 'Patricia López',
    avatar: '',
    estrellas: 4,
    comentario: 'Muy rico todo, especialmente las salsas caseras. El lugar es limpio y el personal muy amable. Solo le faltaría más variedad en bebidas.',
    fecha: '3 de abril, 2026',
    likes: 9,
    liked: false,
    verificado: false,
  },
];

const useReseñasStore = create(
  persist(
    (set, get) => ({
      // ─── ESTADO ───────────────────────────────────────────────────────────
      reseñas: RESEÑAS_INICIALES,

      // ─── ACCIONES: CREAR ──────────────────────────────────────────────────
      addReseña: (nuevaReseña) => {
        set((state) => {
          const maxId = Math.max(...state.reseñas.map((r) => r.id), 0);
          const fecha = new Date().toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          
          const reseñaCompleta = {
            ...nuevaReseña,
            id: maxId + 1,
            fecha,
            likes: 0,
            liked: false,
            verificado: false,
          };
          
          return {
            reseñas: [reseñaCompleta, ...state.reseñas],
          };
        });
      },

      // ─── ACCIONES: TOGGLE LIKE ────────────────────────────────────────────
      toggleLike: (id) => {
        set((state) => ({
          reseñas: state.reseñas.map((r) =>
            r.id === id
              ? {
                  ...r,
                  liked: !r.liked,
                  likes: r.liked ? r.likes - 1 : r.likes + 1,
                }
              : r
          ),
        }));
      },

      // ─── ACCIONES: ELIMINAR ───────────────────────────────────────────────
      deleteReseña: (id) => {
        set((state) => ({
          reseñas: state.reseñas.filter((r) => r.id !== id),
        }));
      },

      // ─── ACCIONES: RESET ──────────────────────────────────────────────────
      resetReseñas: () => {
        set({ reseñas: RESEÑAS_INICIALES });
      },

      // ─── GETTERS ──────────────────────────────────────────────────────────
      getReseñaById: (id) => {
        return get().reseñas.find((r) => r.id === id);
      },

      getReseñasByEstrellas: (estrellas) => {
        return get().reseñas.filter((r) => r.estrellas === estrellas);
      },

      getPromedioEstrellas: () => {
        const reseñas = get().reseñas;
        if (reseñas.length === 0) return 0;
        const suma = reseñas.reduce((acc, r) => acc + r.estrellas, 0);
        return (suma / reseñas.length).toFixed(1);
      },

      getTotalReseñas: () => {
        return get().reseñas.length;
      },
    }),
    {
      name: 'compadrito-reseñas-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

export default useReseñasStore;
