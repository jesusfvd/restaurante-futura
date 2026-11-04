import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { Eye, EyeOff, Flame, LogOut, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, firebaseConfigured } from '../firebase';
import './AuthGate.css';

// 👤 Usuarios Demo (hardcodeados)
const DEMO_USERS = [
  { email: 'admin@compadrito.com', password: 'admin123', name: 'Administrador' },
  { email: 'chef@compadrito.com', password: 'chef123', name: 'Chef Principal' },
  { email: 'demo@demo.com', password: 'demo123', name: 'Usuario Demo' },
];

const AUTH_ERRORS = {
  'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'Escribe un correo válido.',
  'auth/too-many-requests': 'Hubo demasiados intentos. Espera un momento e inténtalo de nuevo.',
  'auth/network-request-failed': 'No se pudo conectar. Revisa tu conexión e inténtalo otra vez.',
};

export default function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Verificar si hay usuario demo guardado
    const savedDemoUser = localStorage.getItem('demoUser');
    if (savedDemoUser && !firebaseConfigured) {
      setUser(JSON.parse(savedDemoUser));
      setAuthReady(true);
      return;
    }

    if (!auth) {
      setAuthReady(true);
      return undefined;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setMessage('');

    // Simular delay de red para parecer real
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (!firebaseConfigured) {
        // 🎭 Modo DEMO - Autenticación local
        const user = DEMO_USERS.find(
          u => u.email.toLowerCase() === email.trim().toLowerCase() && 
               u.password === password
        );

        if (mode === 'register') {
          // En modo registro, crear usuario demo temporal
          const newUser = {
            email: email.trim(),
            displayName: email.split('@')[0],
            uid: 'demo-' + Date.now(),
          };
          setUser(newUser);
          localStorage.setItem('demoUser', JSON.stringify(newUser));
        } else {
          // En modo login, validar contra usuarios demo
          if (user) {
            const demoUser = {
              email: user.email,
              displayName: user.name,
              uid: 'demo-' + user.email,
            };
            setUser(demoUser);
            localStorage.setItem('demoUser', JSON.stringify(demoUser));
          } else {
            setMessage('❌ Correo o contraseña incorrectos. Prueba: demo@demo.com / demo123');
          }
        }
      } else {
        // Firebase real
        if (mode === 'register') {
          await createUserWithEmailAndPassword(auth, email.trim(), password);
        } else {
          await signInWithEmailAndPassword(auth, email.trim(), password);
        }
      }
    } catch (error) {
      setMessage(AUTH_ERRORS[error.code] || 'No se pudo completar el acceso. Inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!auth || !email.trim()) {
      setMessage('Escribe tu correo para enviarte el enlace de recuperación.');
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('Si existe una cuenta con ese correo, recibirás un enlace para cambiar tu contraseña.');
    } catch (error) {
      setMessage(AUTH_ERRORS[error.code] || 'No se pudo enviar el enlace. Revisa el correo e inténtalo otra vez.');
    } finally {
      setBusy(false);
    }
  };

  if (!authReady) {
    return <div className="auth-loading" role="status">Comprobando acceso…</div>;
  }

  if (user) {
    return (
      <>
        <div className="auth-session-bar">
          <span>{user.displayName || user.email}</span>
          <button 
            type="button" 
            onClick={() => {
              if (!firebaseConfigured) {
                // Logout demo
                localStorage.removeItem('demoUser');
                setUser(null);
              } else {
                signOut(auth);
              }
            }} 
            aria-label="Cerrar sesión"
          >
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>
        {children}
      </>
    );
  }

  return (
    <main className="auth-screen">
      <video
        className="auth-background-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/login-brasas-poster.jpg"
        aria-hidden="true"
      >
        <source src="/videos/login-brasas.mp4" type="video/mp4" />
      </video>
      <div className="auth-background-shade" />

      <AnimatePresence mode="wait">
        <motion.section 
          key={mode}
          className="auth-panel" 
          aria-labelledby="auth-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Logo elegante */}
          <motion.div 
            className="auth-brand"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <img src="/images/black%20logo.png" alt="Compadrito Pollos" />
          </motion.div>

          {/* Título minimalista */}
          <motion.h1 
            id="auth-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {mode === 'register' ? 'Únete' : 'Bienvenido'}
          </motion.h1>

          <motion.form 
            className="auth-form" 
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
              {/* Campo de email con icono */}
              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <Mail size={18} />
                </div>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              {/* Campo de contraseña con icono */}
              <div className="auth-input-group">
                <div className="auth-input-icon">
                  <Lock size={18} />
                </div>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Contraseña"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-show-password"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Mensaje de error elegante */}
              <AnimatePresence>
                {message && (
                  <motion.p 
                    className="auth-message" 
                    role="status"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Botón principal elegante */}
              <motion.button 
                className="auth-submit" 
                type="submit" 
                disabled={busy}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {busy ? (
                  <span className="auth-loading-dots">
                    <span>•</span>
                    <span>•</span>
                    <span>•</span>
                  </span>
                ) : mode === 'register' ? 'Crear Cuenta' : 'Acceder'}
              </motion.button>

              {/* Opciones adicionales */}
              <div className="auth-options">
                {mode === 'login' && (
                  <button 
                    className="auth-text-button" 
                    type="button" 
                    onClick={resetPassword} 
                    disabled={busy}
                  >
                    Recuperar contraseña
                  </button>
                )}

                <div className="auth-divider">
                  <span></span>
                  <span>o</span>
                  <span></span>
                </div>

                <button
                  type="button"
                  className="auth-switch-button"
                  onClick={() => {
                    setMode(mode === 'register' ? 'login' : 'register');
                    setMessage('');
                  }}
                >
                  {mode === 'register' ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}
                </button>
              </div>
            </motion.form>          {/* Footer minimalista */}
          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Flame size={14} strokeWidth={2.5} />
            <span>Asados al Carbón</span>
          </motion.div>
        </motion.section>
      </AnimatePresence>
    </main>
  );
}