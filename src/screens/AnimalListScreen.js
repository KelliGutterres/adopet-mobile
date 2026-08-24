import { useCallback, useMemo, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { listarAnimais } from '../services/animaisService';
import { animalMatchesFilters, LIST_COPY } from '../services/animalLabels';
import { colors, statusTheme } from '../theme/colors';
import AnimalCard from '../components/AnimalCard';
import AppHeader from '../components/AppHeader';
import SearchBar from '../components/SearchBar';

export default function AnimalListScreen({ route }) {
  const status = route?.params?.status || 'A';
  const theme = statusTheme[status] || statusTheme.A;
  const copy = LIST_COPY[status] || LIST_COPY.A;
  const { logout } = useAuth();

  const [animais, setAnimais] = useState([]);
  const [busca, setBusca] = useState('');
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
        const lista = await listarAnimais({ status });
        setAnimais(lista);
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
    [logout, status],
  );

  useFocusEffect(
    useCallback(() => {
      load({ silent: true });
    }, [load]),
  );

  const filtrados = useMemo(
    () => animais.filter((animal) => animalMatchesFilters(animal, { busca })),
    [animais, busca],
  );

  const empty = loading || error || filtrados.length === 0;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: theme.primary }}>
        <AppHeader primaryColor={theme.primary} />
        <View style={styles.heading}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </View>
      </View>
      <View style={styles.searchWrap}>
        <SearchBar
          value={busca}
          onChangeText={setBusca}
          showPhotoSearch={status === 'E' || status === 'P'}
        />
      </View>
      <FlatList
        data={loading || error ? [] : filtrados}
        keyExtractor={(item) => String(item.idAnimal)}
        renderItem={({ item }) => <AnimalCard animal={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[styles.list, empty ? styles.listGrow : null]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        accessibilityRole="list"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load({ pull: true })}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.state} accessibilityLiveRegion="polite">
              <ActivityIndicator color={theme.primary} size="large" />
              <Text style={styles.stateText}>Carregando animais…</Text>
            </View>
          ) : error ? (
            <View style={styles.state}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable
                onPress={() => load()}
                accessibilityRole="button"
                accessibilityLabel="Tentar novamente"
                style={({ pressed }) => [
                  styles.retry,
                  { backgroundColor: theme.primary },
                  pressed && styles.retryPressed,
                ]}
              >
                <Text style={styles.retryText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : animais.length === 0 ? (
            <View style={styles.state}>
              <Text style={styles.stateText}>{copy.empty}</Text>
            </View>
          ) : (
            <View style={styles.state}>
              <Text style={styles.stateText}>Nenhum animal encontrado com essa busca.</Text>
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
  heading: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  title: {
    color: colors.surface,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    marginTop: 4,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
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
