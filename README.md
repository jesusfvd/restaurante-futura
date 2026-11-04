# 🍗 Compadrito Pollos - Restaurante Futura

Sitio web moderno y elegante para el restaurante **Compadrito Pollos**, especializado en pollos asados al carbón estilo Sinaloa.

## ✨ Características

- 🎨 **Diseño Premium** con animaciones suaves usando Framer Motion
- 🔐 **Sistema de autenticación** con Firebase (modo demo disponible)
- 📱 **Totalmente Responsive** - Se adapta a móviles, tablets y desktop
- 🛒 **Carrito de compras** con Zustand
- 🌐 **SEO Optimizado** con React Helmet
- 🎯 **Navegación fluida** con React Router
- 💳 **Integración de pagos** preparada (Stripe)
- ⭐ **Sistema de reseñas** integrado

## 🚀 Tecnologías

- **React 18** - Framework principal
- **React Router** - Navegación
- **Framer Motion** - Animaciones
- **Zustand** - Gestión de estado
- **Tailwind CSS** - Estilos
- **Three.js** - Gráficos 3D
- **Firebase** - Autenticación
- **React Helmet** - SEO

## 📦 Instalación

### Prerrequisitos

- Node.js 16+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/jesusfvd/restaurante-futura.git
cd restaurante-futura
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno (opcional)**

Copia `.env.example` a `.env` y configura tus credenciales de Firebase:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Firebase Console.

4. **Iniciar el servidor de desarrollo**
```bash
npm start
# o
yarn start
```

El sitio se abrirá en `http://localhost:3000`

## 🔑 Modo Demo

Si no configuras Firebase, el sistema funciona en **modo demo** con usuarios de prueba:

- **Email:** `demo@demo.com` | **Contraseña:** `demo123`
- **Email:** `admin@compadrito.com` | **Contraseña:** `admin123`
- **Email:** `chef@compadrito.com` | **Contraseña:** `chef123`

O crea tu propia cuenta demo con cualquier email.

## 📁 Estructura del Proyecto

```
restaurante-futura/
├── public/
│   ├── images/          # Imágenes estáticas
│   └── videos/          # Videos de fondo (excluidos de git por tamaño)
├── src/
│   ├── components/      # Componentes React
│   │   ├── sections/    # Secciones de la página
│   │   ├── AuthGate.jsx # Sistema de autenticación
│   │   ├── Header.jsx   # Navegación
│   │   └── ...
│   ├── data/           # Datos del menú y productos
│   ├── hooks/          # Custom hooks
│   ├── store/          # Zustand stores
│   ├── styles/         # Estilos globales
│   ├── utils/          # Utilidades y helpers
│   ├── firebase.js     # Configuración Firebase
│   └── App.js          # Componente principal
├── .env.example        # Variables de entorno de ejemplo
├── .gitignore         # Archivos ignorados
├── package.json       # Dependencias
└── README.md          # Este archivo
```

## 🎨 Características del Diseño

### Login Elegante
- Glassmorphism con blur premium
- Tipografía Cormorant Garamond (títulos)
- Tipografía Montserrat (cuerpo)
- Colores dorado y rojo brasa
- Animaciones suaves con Framer Motion

### Página Principal
- Hero section con video de fondo
- Sección "Sobre Nosotros"
- Galería del proceso
- Menú premium con productos
- Sistema de reseñas
- Formulario de contacto

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia el servidor de desarrollo

# Producción
npm run build      # Crea build optimizado

# Testing
npm test           # Ejecuta los tests
```

## 📝 Configuración de Firebase (Opcional)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication → Email/Password**
4. Ve a **Project Settings → Your apps → Web app**
5. Copia las credenciales al archivo `.env`

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Sube la carpeta build/
```

## 📞 Contacto

**Compadrito Pollos**
- WhatsApp: +1 (818) 938-6936
- Ubicación: Sinaloa, México

## 📄 Licencia

Este proyecto es privado y pertenece a Compadrito Pollos.

---

**Desarrollado con ❤️ para Compadrito Pollos** 🍗🔥
