import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  listarNotificacoes,
  marcarNotificacaoLida,
  marcarTodasNotificacoesLidas,
} from '../services/notificacoesService';

const POLL_MS = 30000;
const NotificacoesContext = createContext(null);

export function NotificacoesProvider({ children }) {
  const { logout } = useAuth();
  const [naoLidas, setNaoLidas] = useState(0);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const recarregar = useCallback(
    async ({ silent } = {}) => {
      if (!silent) {
        setLoading(true);
      }
      try {
        const dados = await listarNotificacoes();
        setNaoLidas(dados.naoLidas);
        setNotificacoes(dados.notificacoes);
        setError('');
      } catch (err) {
        if (err.status === 401) {
          await logout();
          return;
        }
        setError(err.message || 'Erro na requisição');
      } finally {
        setLoading(false);
      }
    },
    [logout],
  );

  useEffect(() => {
    recarregar();
    const id = setInterval(() => {
      recarregar({ silent: true });
    }, POLL_MS);
    return () => clearInterval(id);
  }, [recarregar]);

  const marcarLida = useCallback(
    async (idNotificacao) => {
      await marcarNotificacaoLida(idNotificacao);
      await recarregar({ silent: true });
    },
    [recarregar],
  );

  const marcarTodas = useCallback(async () => {
    await marcarTodasNotificacoesLidas();
    await recarregar({ silent: true });
  }, [recarregar]);

  const value = useMemo(
    () => ({
      naoLidas,
      notificacoes,
      loading,
      error,
      recarregar,
      marcarLida,
      marcarTodas,
    }),
    [naoLidas, notificacoes, loading, error, recarregar, marcarLida, marcarTodas],
  );

  return <NotificacoesContext.Provider value={value}>{children}</NotificacoesContext.Provider>;
}

export function useNotificacoes() {
  const ctx = useContext(NotificacoesContext);
  if (!ctx) {
    throw new Error('useNotificacoes deve ser usado dentro de NotificacoesProvider');
  }
  return ctx;
}
