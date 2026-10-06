import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '../components/ListIcons';
import { useNotificacoes } from '../context/NotificacoesContext';
import { colors } from '../theme/colors';

function formatarData(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { naoLidas, notificacoes, loading, error, recarregar, marcarLida, marcarTodas } =
    useNotificacoes();
  const [refreshing, setRefreshing] = useState(false);
  const [acaoErro, setAcaoErro] = useState('');

  useFocusEffect(
    useCallback(() => {
      recarregar({ silent: true });
    }, [recarregar]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await recarregar({ silent: true });
    setRefreshing(false);
  }

  async function abrir(item) {
    setAcaoErro('');
    try {
      if (!item.lida) {
        await marcarLida(item.idNotificacao);
      }
    } catch (err) {
      setAcaoErro(err.message || 'Erro na requisição');
      return;
    }

    if (item.animal?.idAnimal) {
      navigation.navigate('AnimalDetail', {
        idAnimal: item.animal.idAnimal,
        status: item.animal.status,
      });
    }
  }

  async function onMarcarTodas() {
    setAcaoErro('');
    try {
      await marcarTodas();
    } catch (err) {
      setAcaoErro(err.message || 'Erro na requisição');
    }
  }

  const vazio = loading || error || notificacoes.length === 0;
  const mensagemErro = acaoErro || error;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={[styles.top, { paddingTop: insets.top + 4 }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.headerBtn}
          >
            <ChevronLeftIcon color={colors.surface} size={22} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Notificações
          </Text>
          {naoLidas > 0 ? (
            <Pressable
              onPress={onMarcarTodas}
              accessibilityRole="button"
              accessibilityLabel="Marcar todas como lidas"
              style={styles.headerAction}
            >
              <Text style={styles.headerActionText}>Lidas</Text>
            </Pressable>
          ) : (
            <View style={styles.headerBtn} />
          )}
        </View>
      </View>

      <FlatList
        data={loading || error ? [] : notificacoes}
        keyExtractor={(item) => String(item.idNotificacao)}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => abrir(item)}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.card,
              item.lida ? null : styles.cardUnread,
              pressed ? styles.cardPressed : null,
            ]}
          >
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardMessage}>{item.mensagem}</Text>
            <Text style={styles.cardMeta}>
              {formatarData(item.criadoEm)}
              {item.animal ? '' : ' · Animal não está mais no sistema'}
            </Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[styles.list, vazio ? styles.listGrow : null]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.state}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : mensagemErro ? (
            <View style={styles.state}>
              <Text style={styles.errorText}>{mensagemErro}</Text>
              <Pressable
                onPress={() => recarregar()}
                accessibilityRole="button"
                style={({ pressed }) => [styles.retry, pressed ? styles.retryPressed : null]}
              >
                <Text style={styles.retryText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.state}>
              <Text style={styles.emptyTitle}>Nenhuma notificação ainda.</Text>
              <Text style={styles.stateText}>
                Quando alguém cadastrar um animal, o aviso aparece aqui.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.listBackground,
  },
  top: {
    backgroundColor: colors.primary,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    minHeight: 52,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAction: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.surface,
    fontSize: 18,
    fontWeight: '800',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  listGrow: {
    flexGrow: 1,
  },
  separator: {
    height: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cardUnread: {
    backgroundColor: '#F3E8FF',
    borderColor: '#DDD6FE',
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  cardMessage: {
    marginTop: 4,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  cardMeta: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
  },
  state: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateText: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    color: colors.danger,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retry: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  retryPressed: {
    opacity: 0.85,
  },
  retryText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 15,
  },
});
