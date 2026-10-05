import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../hooks/useAuth';
import { compararAnimais } from '../services/animaisService';
import { startPhotoSearch } from '../services/imagePicker';
import { colors } from '../theme/colors';
import AnimalCard from '../components/AnimalCard';
import AnimalPhoto from '../components/AnimalPhoto';
import AppHeader from '../components/AppHeader';

const THEME = { primary: colors.primary, chipBg: '#F3E8FF' };

function labelResultados(count) {
  if (count === 1) {
    return '1 animal semelhante';
  }
  return `${count} animais semelhantes`;
}

export default function SimilarityScreen({ navigation, route }) {
  const { logout } = useAuth();
  const requestIdRef = useRef(0);

  const [queryUri, setQueryUri] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const compare = useCallback(
    async (uri) => {
      if (!uri) {
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setQueryUri(uri);
      setSearched(true);
      setLoading(true);
      setError('');
      setCandidatos([]);

      try {
        const lista = await compararAnimais(uri);
        if (requestId !== requestIdRef.current) {
          return;
        }
        setCandidatos(lista);
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        if (err.status === 401) {
          await logout();
          return;
        }
        setCandidatos([]);
        setError(err.message || 'Erro na requisição');
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [logout],
  );

  useEffect(() => {
    const uri = route?.params?.photoUri;
    if (typeof uri !== 'string' || !uri) {
      return;
    }
    navigation.setParams({ photoUri: null });
    compare(uri);
  }, [compare, navigation, route?.params?.photoUri]);

  function handlePickError(err) {
    Alert.alert('Não foi possível usar a foto', err?.message || 'Erro na requisição');
  }

  function handleChoosePhoto() {
    if (loading) {
      return;
    }
    startPhotoSearch({
      onPicked: (uri) => compare(uri),
      onError: handlePickError,
    });
  }

  const empty = loading || error || !searched || candidatos.length === 0;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: colors.primary }}>
        <AppHeader primaryColor={colors.primary} />
        <View style={styles.heading}>
          <Text style={styles.title}>Busca por Foto</Text>
          <Text style={styles.subtitle}>
            Envie uma foto para encontrar animais perdidos ou encontrados parecidos
          </Text>
        </View>
      </View>

      {queryUri ? (
        <View style={styles.queryRow}>
          <AnimalPhoto uri={queryUri} nome="" theme={THEME} size={56} borderRadius={10} />
          <Text style={styles.queryLabel} numberOfLines={2}>
            Foto enviada
          </Text>
          <Pressable
            onPress={handleChoosePhoto}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Nova busca"
            style={({ pressed }) => [
              styles.newSearch,
              (pressed || loading) && styles.newSearchPressed,
            ]}
          >
            <Text style={styles.newSearchText}>Nova busca</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={loading || error ? [] : candidatos}
        keyExtractor={(item, index) =>
          String(item?.animal?.idAnimal || `candidato-${index}`)
        }
        renderItem={({ item }) => {
          const animal = item?.animal;
          if (!animal?.idAnimal) {
            return null;
          }
          return (
            <AnimalCard
              animal={animal}
              showStatus
              scoreSimilarity={item.scoreSimilarity}
              onPress={() =>
                navigation.navigate('AnimalDetail', {
                  idAnimal: animal.idAnimal,
                  status: animal.status,
                })
              }
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[styles.list, empty ? styles.listGrow : null]}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="list"
        ListHeaderComponent={
          !loading && !error && candidatos.length > 0 ? (
            <Text style={styles.count}>{labelResultados(candidatos.length)}</Text>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.state} accessibilityLiveRegion="polite">
              <ActivityIndicator color={colors.primary} size="large" />
              <Text style={styles.stateText}>
                Comparando imagens… Pode levar alguns segundos.
              </Text>
            </View>
          ) : error ? (
            <View style={styles.state}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable
                onPress={() => (queryUri ? compare(queryUri) : handleChoosePhoto())}
                accessibilityRole="button"
                accessibilityLabel="Tentar novamente"
                style={({ pressed }) => [
                  styles.cta,
                  pressed && styles.ctaPressed,
                ]}
              >
                <Text style={styles.ctaText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : !searched ? (
            <View style={styles.state}>
              <Pressable
                onPress={handleChoosePhoto}
                accessibilityRole="button"
                accessibilityLabel="Buscar por foto"
                style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
              >
                <Text style={styles.ctaText}>Buscar por foto</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.state}>
              <Text style={styles.stateText}>Nenhum animal semelhante encontrado.</Text>
              {queryUri ? null : (
                <Pressable
                  onPress={handleChoosePhoto}
                  accessibilityRole="button"
                  accessibilityLabel="Buscar por foto"
                  style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
                >
                  <Text style={styles.ctaText}>Buscar por foto</Text>
                </Pressable>
              )}
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
    lineHeight: 20,
  },
  queryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  queryLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  newSearch: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  newSearchPressed: {
    opacity: 0.7,
  },
  newSearchText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 10,
  },
  listGrow: {
    flexGrow: 1,
  },
  count: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
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
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 15,
  },
});
