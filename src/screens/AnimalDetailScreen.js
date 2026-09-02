import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import {
  buscarAnimal,
  excluirAnimal,
  isAnimalDoUsuario,
  parseIdAnimal,
} from '../services/animaisService';
import { isStatusPermitido } from '../services/animalForm';
import {
  labelCidade,
  labelEspecie,
  labelIdade,
  labelPorte,
  labelResponsavel,
  labelStatus,
  tituloCard,
} from '../services/animalLabels';
import { ChevronLeftIcon, MapPinIcon, PencilIcon, TrashIcon } from '../components/ListIcons';
import AnimalPhoto from '../components/AnimalPhoto';
import { colors, statusTheme } from '../theme/colors';

function Chip({ label, backgroundColor, color }) {
  if (!label) {
    return null;
  }
  return (
    <View style={[styles.chip, { backgroundColor }]}>
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
}

function InfoRow({ label, value }) {
  if (!value) {
    return null;
  }
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function themeStatus(status) {
  if (status === 'A' || status === 'P' || status === 'E') {
    return status;
  }
  return null;
}

export default function AnimalDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { usuario, logout } = useAuth();

  const idAnimal = parseIdAnimal(route?.params?.idAnimal);
  const statusHint = themeStatus(route?.params?.status);
  const fromMyAnimals = route?.params?.from === 'MyAnimals';

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canRetry, setCanRetry] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const status = themeStatus(animal?.status) || statusHint;
  const theme = (status && statusTheme[status]) || statusTheme.A;
  const headerColor = status ? theme.primary : colors.muted;
  const canManage =
    fromMyAnimals &&
    Boolean(animal) &&
    isStatusPermitido(animal.status) &&
    isAnimalDoUsuario(animal, usuario?.idUsuario);
  const headerWide = fromMyAnimals;

  const load = useCallback(
    async ({ silent } = {}) => {
      if (!idAnimal) {
        return;
      }

      if (!silent) {
        setLoading(true);
      }
      setError('');
      setCanRetry(false);
      try {
        const data = await buscarAnimal(idAnimal);
        if (!data) {
          setAnimal(null);
          setError('Animal não encontrado.');
          return;
        }
        setAnimal(data);
      } catch (err) {
        if (err.status === 401) {
          await logout();
          return;
        }
        setAnimal(null);
        if (err.status === 404 || err.status === 400) {
          setError(err.status === 404 ? 'Animal não encontrado.' : err.message || 'id inválido');
          setCanRetry(false);
        } else {
          setError(err.message || 'Erro na requisição');
          setCanRetry(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [idAnimal, logout],
  );

  useFocusEffect(
    useCallback(() => {
      if (!idAnimal) {
        navigation.goBack();
        return;
      }
      load({ silent: true });
    }, [idAnimal, load, navigation]),
  );

  function handleEdit() {
    if (!canManage || deleting) {
      return;
    }
    navigation.navigate('AnimalForm', {
      idAnimal: animal.idAnimal,
      status: animal.status,
    });
  }

  function handleDelete() {
    if (!canManage || deleting) {
      return;
    }
    const nome = (animal?.nome || '').trim() || 'animal';
    Alert.alert(
      'Excluir animal',
      `Excluir ${nome}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ],
    );
  }

  async function confirmDelete() {
    if (deleting) {
      return;
    }
    setDeleting(true);
    setError('');
    try {
      await excluirAnimal(animal.idAnimal);
      navigation.navigate('MyAnimals');
    } catch (err) {
      if (err.status === 401) {
        await logout();
        return;
      }
      Alert.alert('Não foi possível excluir', err.message || 'Erro na requisição');
    } finally {
      setDeleting(false);
    }
  }

  if (!idAnimal) {
    return null;
  }

  const title = animal ? tituloCard(animal) : '';
  const nomeCadastrado = (animal?.nome || '').trim();
  const especie = labelEspecie(animal?.especie);
  const porte = labelPorte(animal?.porte);
  const idade = labelIdade(animal?.idade);
  const raca = (animal?.raca?.nome || '').trim();
  const descricao = (animal?.descricao || '').trim();
  const cidade = labelCidade(animal?.cidade);
  const responsavel = animal ? labelResponsavel(animal) : { label: '', value: '' };
  const situacao = labelStatus(animal?.status);
  const showInfos = Boolean(especie || raca || idade || porte);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={[styles.top, { backgroundColor: headerColor, paddingTop: insets.top + 4 }]}>
        <View style={styles.header}>
          <View style={[styles.headerSide, headerWide ? styles.headerSideWide : null]}>
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              style={styles.back}
            >
              <ChevronLeftIcon color={colors.surface} size={22} />
            </Pressable>
            {headerWide ? <View style={styles.back} /> : null}
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Detalhes
          </Text>
          <View style={[styles.headerSide, headerWide ? styles.headerSideWide : null]}>
            {canManage ? (
              <>
                <Pressable
                  onPress={handleEdit}
                  disabled={deleting}
                  accessibilityRole="button"
                  accessibilityLabel="Editar animal"
                  accessibilityState={{ disabled: deleting }}
                  style={styles.back}
                >
                  <PencilIcon color={colors.surface} size={22} />
                </Pressable>
                <Pressable
                  onPress={handleDelete}
                  disabled={deleting}
                  accessibilityRole="button"
                  accessibilityLabel="Excluir animal"
                  accessibilityState={{ disabled: deleting, busy: deleting }}
                  style={styles.back}
                >
                  <TrashIcon color={colors.danger} size={22} />
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.back} />
                {headerWide ? <View style={styles.back} /> : null}
              </>
            )}
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <ActivityIndicator color={headerColor} size="large" />
          <Text style={styles.stateText}>Carregando detalhes…</Text>
        </View>
      ) : error || !animal ? (
        <View style={styles.state}>
          <Text style={styles.errorText}>{error || 'Animal não encontrado.'}</Text>
          {canRetry ? (
            <Pressable
              onPress={load}
              accessibilityRole="button"
              accessibilityLabel="Tentar novamente"
              style={({ pressed }) => [
                styles.action,
                { backgroundColor: headerColor },
                pressed && styles.actionPressed,
              ]}
            >
              <Text style={styles.actionText}>Tentar novamente</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Voltar à lista"
              style={({ pressed }) => [
                styles.action,
                { backgroundColor: headerColor },
                pressed && styles.actionPressed,
              ]}
            >
              <Text style={styles.actionText}>Voltar à lista</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: Math.max(insets.bottom, 16) + 16 },
          ]}
        >
          <View style={styles.heroCard}>
            <AnimalPhoto
              uri={animal.urlImagem}
              nome={nomeCadastrado}
              theme={theme}
              fill
              borderRadius={0}
              style={styles.heroPhoto}
            />
            <View style={styles.heroBody}>
              <Text style={styles.title}>{title}</Text>
              {situacao ? (
                <Chip label={situacao} backgroundColor={theme.chipBg} color={theme.chipText} />
              ) : null}
              {animal?.status === 'E' && nomeCadastrado ? (
                <View style={styles.nomeCadastrado}>
                  <Text style={styles.infoLabel}>Nome cadastrado</Text>
                  <Text style={styles.infoValue}>{nomeCadastrado}</Text>
                </View>
              ) : null}
              <View style={styles.chips}>
                <Chip label={especie} backgroundColor={theme.chipBg} color={theme.chipText} />
                <Chip label={porte} backgroundColor={colors.chipPorteBg} color={colors.chipPorteText} />
              </View>
            </View>
          </View>

          {descricao ? (
            <View style={styles.card}>
              <Text style={styles.section}>Descrição</Text>
              <Text style={styles.bodyText}>{descricao}</Text>
            </View>
          ) : null}

          {showInfos ? (
            <View style={styles.card}>
              <Text style={styles.section}>Informações</Text>
              <InfoRow label="Espécie" value={especie} />
              <InfoRow label="Raça" value={raca} />
              <InfoRow label="Idade" value={idade} />
              <InfoRow label="Porte" value={porte} />
            </View>
          ) : null}

          {cidade ? (
            <View style={styles.card}>
              <Text style={styles.section}>Localização</Text>
              <View style={styles.location}>
                <MapPinIcon color={colors.muted} size={16} />
                <Text style={styles.bodyText}>{cidade}</Text>
              </View>
            </View>
          ) : null}

          {responsavel.value ? (
            <View style={styles.card}>
              <Text style={styles.section}>{responsavel.label}</Text>
              <Text style={styles.bodyText}>{responsavel.value}</Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.listBackground,
  },
  top: {
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    minHeight: 52,
  },
  headerSide: {
    width: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSideWide: {
    width: 88,
  },
  back: {
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
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  heroPhoto: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heroBody: {
    padding: 16,
    gap: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  nomeCadastrado: {
    gap: 2,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  chip: {
    alignSelf: 'center',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  bodyText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  infoRow: {
    gap: 2,
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  state: {
    flex: 1,
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
  action: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
    justifyContent: 'center',
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 15,
  },
});
