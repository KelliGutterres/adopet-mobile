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
import { useAuth } from '../hooks/useAuth';
import { isAnimalDoUsuario, listarAnimais } from '../services/animaisService';
import AnimalCard from '../components/AnimalCard';
import { ChevronLeftIcon } from '../components/ListIcons';
import { colors } from '../theme/colors';

export default function MyAnimalsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, logout } = useAuth();

  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(
    async ({ pull, silent } = {}) => {
      if (pull) {
        setRefreshing(true);
      } else if (!silent) {
        setLoading(true);
      }
      setError('');
      try {
        const lista = await listarAnimais();
        const meus = lista.filter((animal) => isAnimalDoUsuario(animal, usuario?.idUsuario));
        setAnimais(meus);
      } catch (err) {
        if (err.status === 401) {
          await logout();
          return;
        }
        setAnimais([]);
        setError(err.message || 'Erro na requisição');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [logout, usuario?.idUsuario],
  );

  useFocusEffect(
    useCallback(() => {
      load({ silent: true });
    }, [load]),
  );

  const empty = loading || error || animais.length === 0;

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
            Meus animais
          </Text>
          <View style={styles.headerBtn} />
        </View>
      </View>

      <FlatList
        data={loading || error ? [] : animais}
        keyExtractor={(item) => String(item.idAnimal)}
        renderItem={({ item }) => (
          <AnimalCard
            animal={item}
            showNome
            showStatus
            onPress={() =>
              navigation.navigate('AnimalDetail', {
                idAnimal: item.idAnimal,
                status: item.status,
                from: 'MyAnimals',
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.list,
          empty ? styles.listGrow : null,
          { paddingBottom: Math.max(insets.bottom, 16) + 16 },
        ]}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="list"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load({ pull: true })}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.state} accessibilityLiveRegion="polite">
              <ActivityIndicator color={colors.primary} size="large" />
              <Text style={styles.stateText}>Carregando seus animais…</Text>
            </View>
          ) : error ? (
            <View style={styles.state}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable
                onPress={() => load()}
                accessibilityRole="button"
                accessibilityLabel="Tentar novamente"
                style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
              >
                <Text style={styles.retryText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.state}>
              <Text style={styles.emptyTitle}>Você ainda não cadastrou animais.</Text>
              <Text style={styles.stateText}>
                Cadastre um animal perdido ou encontrado pelo botão + nas listas.
              </Text>
              <Pressable
                onPress={() => navigation.navigate('ChooseAnimalStatus')}
                accessibilityRole="button"
                accessibilityLabel="Cadastrar animal"
                style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
              >
                <Text style={styles.retryText}>Cadastrar animal</Text>
              </Pressable>
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
  },
  listGrow: {
    flexGrow: 1,
  },
  separator: {
    height: 10,
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
