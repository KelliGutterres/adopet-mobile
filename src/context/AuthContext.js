import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cadastrarUsuario, loginUsuario, me as fetchMe } from '../services/authService';
import {
  clearSession,
  readStoredToken,
  readStoredUsuario,
  saveSession,
  setMemoryToken,
} from '../services/session';

const AuthContext = createContext(null);

function usuarioFromMe(profile, storedUsuario) {
  if (storedUsuario && storedUsuario.email) {
    return storedUsuario;
  }
  return {
    idUsuario: profile.id,
    email: profile.email,
    nome: profile.email,
  };
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const storedToken = await readStoredToken();
      if (!storedToken) {
        if (!cancelled) {
          setReady(true);
        }
        return;
      }

      setMemoryToken(storedToken);

      try {
        const profile = await fetchMe();
        if (cancelled) {
          return;
        }
        if (profile.papel !== 'usuario') {
          await clearSession();
          setToken(null);
          setUsuario(null);
        } else {
          const storedUsuario = await readStoredUsuario();
          const nextUsuario = usuarioFromMe(profile, storedUsuario);
          setToken(storedToken);
          setUsuario(nextUsuario);
        }
      } catch {
        if (!cancelled) {
          await clearSession();
          setToken(null);
          setUsuario(null);
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      token,
      ready,
      isAuthenticated: Boolean(token),
      async login({ email, senha }) {
        const result = await loginUsuario({ email, senha });
        await saveSession(result.token, result.usuario);
        setToken(result.token);
        setUsuario(result.usuario);
      },
      async cadastrar({ nome, email, senha, contato, cidade }) {
        const result = await cadastrarUsuario({ nome, email, senha, contato, cidade });
        await saveSession(result.token, result.usuario);
        setToken(result.token);
        setUsuario(result.usuario);
      },
      async logout() {
        await clearSession();
        setToken(null);
        setUsuario(null);
      },
    }),
    [usuario, token, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
