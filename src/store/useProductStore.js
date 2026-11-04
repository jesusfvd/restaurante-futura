/**
 * useProductStore.js
 * Store global de productos con Zustand + persistencia en localStorage
 * Sincroniza automáticamente entre admin panel y menú público
 * Incluye compresión de imágenes para evitar límites de localStorage
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const PRODUCT_IMAGE_BY_ID = {
  1: '/images/hero-parrilla.jpg',
  2: '/images/1.jpg',
  3: '/images/producto.png',
  4: 'https://www.mexicoenmicocina.com/wp-content/uploads/2017/07/Frijoles-Puercos-1.jpg',
  5: 'https://guerrerotortillas.com/wp-content/uploads/2021/04/manchego-cheese-quesadillas.jpg',
  6: 'https://recetasdecocina.elmundo.es/wp-content/uploads/2022/09/tacos-de-pollo-receta.jpg',
  7: 'https://losmilagrosdedalila.com/wp-content/uploads/2017/03/agua-horchata.png',
  8: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/cec404315c4eacc8646499405ffbb085/Derivates/e80753879c0c6e2583a1b652fb8800a540ef6ca6.jpg',
  9: 'https://static.bainet.es/clip/bbddc81c-becc-476e-ab6b-b0f2de49388e_source-aspect-ratio_1600w_0.jpg',
};

// Función para comprimir imágenes base64
const compressBase64Image = (base64String, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    if (!base64String.startsWith('data:image')) {
      resolve(base64String);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      resolve(base64String);
    };

    img.src = base64String;
  });
};

// Storage personalizado con manejo de errores
const customStorage = {
  getItem: (name) => {
    try {
      const str = localStorage.getItem(name);
      return str ? JSON.parse(str) : null;
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
      console.log('✅ Productos guardados en localStorage');
    } catch (error) {
      console.error('❌ Error al guardar en localStorage:', error);
      if (error.name === 'QuotaExceededError') {
        alert('El almacenamiento está lleno. Las imágenes son demasiado grandes. Intenta con imágenes más pequeñas o usa URLs.');
      }
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
    }
  },
};

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    nombre: 'Pollo Entero',
    descripcion: 'Pollo completo asado en varilla sobre brasas',
    descripcionCorta: 'Pollo completo asado en varilla sobre brasas',
    precio: 20,
    stock: 50,
    categoria: 'pollos',
    imagen: PRODUCT_IMAGE_BY_ID[1],
    popular: true,
    emoji: '🍗',
  },
  {
    id: 2,
    nombre: 'Medio Pollo',
    descripcion: 'Media porción perfecta para una persona',
    descripcionCorta: 'Media porción perfecta para una persona',
    precio: 13,
    stock: 75,
    categoria: 'pollos',
    imagen: PRODUCT_IMAGE_BY_ID[2],
    popular: true,
    emoji: '🍗',
  },
  {
    id: 3,
    nombre: 'Pollo Enchilado',
    descripcion: 'Versión picante con chile especial',
    descripcionCorta: 'Versión picante con chile especial',
    precio: 22,
    stock: 30,
    categoria: 'pollos',
    imagen: PRODUCT_IMAGE_BY_ID[3],
    popular: false,
    emoji: '🌶️',
  },
  {
    id: 4,
    nombre: 'Frijoles Puercos',
    descripcion: 'Frijoles refritos con chorizo y queso',
    descripcionCorta: 'Frijoles refritos con chorizo y queso',
    precio: 8,
    stock: 100,
    categoria: 'acompañamientos',
    imagen: PRODUCT_IMAGE_BY_ID[4],
    popular: true,
    emoji: '🫘',
  },
  {
    id: 5,
    nombre: 'Quesadilla Grande',
    descripcion: 'Tortilla de harina con queso fundido',
    descripcionCorta: 'Tortilla de harina con queso fundido',
    precio: 6,
    stock: 80,
    categoria: 'acompañamientos',
    imagen: PRODUCT_IMAGE_BY_ID[5],
    popular: false,
    emoji: '🧀',
  },
  {
    id: 6,
    nombre: 'Tacos de Pollo (3)',
    descripcion: 'Tres tacos con pollo asado',
    descripcionCorta: 'Tres tacos con pollo asado',
    precio: 10,
    stock: 60,
    categoria: 'acompañamientos',
    imagen: PRODUCT_IMAGE_BY_ID[6],
    popular: true,
    emoji: '🌮',
  },
  {
    id: 7,
    nombre: 'Agua de Horchata',
    descripcion: 'Refrescante agua de arroz con canela',
    descripcionCorta: 'Refrescante agua de arroz con canela',
    precio: 4,
    stock: 50,
    categoria: 'bebidas',
    imagen: PRODUCT_IMAGE_BY_ID[7],
    popular: false,
    emoji: '🥤',
  },
  {
    id: 8,
    nombre: 'Agua de Jamaica',
    descripcion: 'Agua natural de flor de jamaica',
    descripcionCorta: 'Agua natural de flor de jamaica',
    precio: 4,
    stock: 50,
    categoria: 'bebidas',
    imagen: PRODUCT_IMAGE_BY_ID[8],
    popular: false,
    emoji: '🥤',
  },
  {
    id: 9,
    nombre: 'Agua de Limón',
    descripcion: 'Limonada natural recién preparada',
    descripcionCorta: 'Limonada natural recién preparada',
    precio: 4,
    stock: 50,
    categoria: 'bebidas',
    imagen: PRODUCT_IMAGE_BY_ID[9],
    popular: false,
    emoji: '🍋',
  },
];

const useProductStore = create(
  persist(
    (set, get) => ({
      productos: PRODUCTOS_INICIALES,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      getProductoById: (id) => {
        return get().productos.find((p) => p.id === id);
      },

      getProductosByCategoria: (categoria) => {
        if (categoria === 'todos') return get().productos;
        return get().productos.filter((p) => p.categoria === categoria);
      },

      getTotalProductos: () => {
        return get().productos.length;
      },

      addProducto: async (nuevoProducto) => {
        // Comprimir imagen si es base64
        let imagenFinal = nuevoProducto.imagen;
        if (imagenFinal && imagenFinal.startsWith('data:image')) {
          console.log('🔄 Comprimiendo imagen...');
          imagenFinal = await compressBase64Image(imagenFinal);
          console.log('✅ Imagen comprimida');
        }

        set((state) => {
          const maxId = Math.max(...state.productos.map((p) => p.id), 0);
          const productoConId = {
            ...nuevoProducto,
            imagen: imagenFinal,
            id: maxId + 1,
            popular: nuevoProducto.popular || false,
            emoji: nuevoProducto.emoji || '🍽️',
            descripcionCorta: nuevoProducto.descripcionCorta || nuevoProducto.descripcion,
          };
          
          const nuevosProductos = [...state.productos, productoConId];
          console.log('📦 Agregando producto. Total:', nuevosProductos.length);
          
          return { productos: nuevosProductos };
        });
      },

      updateProducto: async (id, updates) => {
        // Comprimir imagen si es base64
        let updatesFinal = { ...updates };
        if (updatesFinal.imagen && updatesFinal.imagen.startsWith('data:image')) {
          console.log('🔄 Comprimiendo imagen...');
          updatesFinal.imagen = await compressBase64Image(updatesFinal.imagen);
          console.log('✅ Imagen comprimida');
        }

        set((state) => {
          const nuevosProductos = state.productos.map((p) =>
            p.id === id ? { ...p, ...updatesFinal } : p
          );
          console.log('📝 Actualizando producto ID:', id);
          
          return { productos: nuevosProductos };
        });
      },

      deleteProducto: (id) => {
        set((state) => {
          const nuevosProductos = state.productos.filter((p) => p.id !== id);
          console.log('🗑️ Eliminando producto ID:', id, 'Total restante:', nuevosProductos.length);
          
          return { productos: nuevosProductos };
        });
      },

      resetProductos: () => {
        console.log('🔄 Reseteando productos a valores iniciales');
        set({ productos: PRODUCTOS_INICIALES });
      },
    }),
    {
      name: 'compadrito-products-storage',
      storage: createJSONStorage(() => customStorage),
      version: 5,
      migrate: (persistedState) => ({
        ...persistedState,
        productos: (persistedState.productos || PRODUCTOS_INICIALES).map((producto) => ({
          ...producto,
          imagen: PRODUCT_IMAGE_BY_ID[producto.id] || producto.imagen,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        console.log('💧 Rehidratando store desde localStorage');
        if (state) {
          state.setHasHydrated(true);
          console.log('✅ Store rehidratado. Productos cargados:', state.productos.length);
        }
      },
    }
  )
);

export default useProductStore;
