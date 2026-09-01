import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextField from '../components/TextField';
import { ChevronLeftIcon } from '../components/ListIcons';
import { useAuth } from '../hooks/useAuth';
import {
  atualizarAnimal,
  buscarAnimal,
  criarAnimal,
  isAnimalDoUsuario,
  parseIdAnimal,
} from '../services/animaisService';
import {
  ESPECIE_OPTIONS,
  FORM_COPY,
  IDADE_MAX,
  PORTE_OPTIONS,
  buildAnimalBody,
  emptyAnimalForm,
  formFromAnimal,
  isAnimalFormDirty,
  isStatusPermitido,
  labelIdadeOpcao,
  validateAnimalForm,
} from '../services/animalForm';
import { colors, statusTheme } from '../theme/colors';

function ChipGroup({ label, required, options, value, onChange, accent }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              style={[
                styles.chip,
                selected && { backgroundColor: accent, borderColor: accent },
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AnimalFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { usuario, logout } = useAuth();

  const idAnimal = parseIdAnimal(route?.params?.idAnimal);
  const isEdit = Boolean(idAnimal);
  const statusParam = route?.params?.status;

  const [animalStatus, setAnimalStatus] = useState(
    isStatusPermitido(statusParam) ? statusParam : null,
  );
  const [form, setForm] = useState(() => emptyAnimalForm(usuario));
  const [snapshot, setSnapshot] = useState(() => emptyAnimalForm(usuario));
  const [animalNome, setAnimalNome] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loaded, setLoaded] = useState(!isEdit);
  const [idadeOpen, setIdadeOpen] = useState(false);

  const allowLeaveRef = useRef(false);
  const dirtyRef = useRef(false);

  const status = animalStatus || (isStatusPermitido(statusParam) ? statusParam : null);
  const theme = (isStatusPermitido(status) && statusTheme[status]) || statusTheme.E;
  const copy = FORM_COPY[status] || FORM_COPY.E;
  const dirty = useMemo(
    () => isEdit && isAnimalFormDirty(form, snapshot),
    [isEdit, form, snapshot],
  );
  dirtyRef.current = dirty;

  const idadeOptions = useMemo(
    () => Array.from({ length: IDADE_MAX + 1 }, (_, idade) => idade),
    [],
  );

  useEffect(() => {
    if (!isEdit && !isStatusPermitido(statusParam)) {
      navigation.replace('ChooseAnimalStatus');
    }
  }, [isEdit, statusParam, navigation]);

  useEffect(() => {
    if (!isEdit) {
      return undefined;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const animal = await buscarAnimal(idAnimal);
        if (cancelled) {
          return;
        }
        if (
          !animal ||
          !isStatusPermitido(animal.status) ||
          !isAnimalDoUsuario(animal, usuario?.idUsuario)
        ) {
          setError('Animal não encontrado.');
          setLoaded(false);
          return;
        }
        const next = formFromAnimal(animal);
        setForm(next);
        setSnapshot(next);
        setAnimalNome((animal.nome || '').trim());
        setAnimalStatus(animal.status);
        setLoaded(true);
      } catch (err) {
        if (cancelled) {
          return;
        }
        if (err.status === 401) {
          await logout();
          return;
        }
        setError(err.status === 404 ? 'Animal não encontrado.' : err.message || 'Erro na requisição');
        setLoaded(false);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [idAnimal, isEdit, logout, usuario?.idUsuario]);

  useEffect(() => {
    if (!isEdit) {
      return undefined;
    }
    return navigation.addListener('beforeRemove', (event) => {
      if (allowLeaveRef.current || submitting) {
        if (submitting && !allowLeaveRef.current) {
          event.preventDefault();
        }
        return;
      }
      if (!dirtyRef.current) {
        return;
      }
      event.preventDefault();
      Alert.alert(
        'Descartar alterações?',
        'As alterações não salvas serão perdidas.',
        [
          { text: 'Continuar editando', style: 'cancel' },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => {
              allowLeaveRef.current = true;
              navigation.dispatch(event.data.action);
            },
          },
        ],
      );
    });
  }, [isEdit, navigation, submitting]);

  const leave = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  function updateField(key) {
    return (value) => {
      setForm((current) => ({ ...current, [key]: value }));
    };
  }

  function handleUfChange(value) {
    setForm((current) => ({
      ...current,
      uf: value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase(),
    }));
  }

  async function handleSubmit() {
    setError('');
    const message = validateAnimalForm(form);
    if (message) {
      setError(message);
      return;
    }

    if (isEdit) {
      if (!dirty) {
        allowLeaveRef.current = true;
        leave();
        return;
      }

      const body = buildAnimalBody(form);
      if (!body) {
        setError('Não foi possível salvar');
        return;
      }

      setSubmitting(true);
      try {
        await atualizarAnimal(idAnimal, body);
        allowLeaveRef.current = true;
        leave();
      } catch (err) {
        if (err.status === 401) {
          await logout();
          return;
        }
        setError(err.message || 'Erro na requisição');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const body = buildAnimalBody(form, statusParam);
    if (!body) {
      navigation.replace('ChooseAnimalStatus');
      return;
    }

    setSubmitting(true);
    try {
      await criarAnimal(body);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  { name: 'Perdidos' },
                  { name: 'Encontrados' },
                  { name: 'Adocao' },
                ],
                index: statusParam === 'P' ? 0 : 1,
              },
            },
          ],
        }),
      );
    } catch (err) {
      if (err.status === 401) {
        await logout();
        return;
      }
      setError(err.message || 'Erro na requisição');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isEdit && !isStatusPermitido(statusParam)) {
    return null;
  }

  const idadeLabel = form.idade === '' ? 'Selecione' : labelIdadeOpcao(form.idade);
  const title = isEdit ? 'Editar animal' : copy.title;
  const subtitle = isEdit
    ? loading
      ? 'Carregando animal…'
      : `Atualize os dados de ${animalNome || 'animal'}.`
    : copy.subtitle;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={[styles.top, { backgroundColor: theme.primary, paddingTop: insets.top + 4 }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.back}
          >
            <ChevronLeftIcon color={colors.surface} size={22} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.back} />
        </View>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>

      {isEdit && loading ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <ActivityIndicator color={theme.primary} size="large" />
          <Text style={styles.stateText}>Carregando animal…</Text>
        </View>
      ) : isEdit && !loaded ? (
        <View style={styles.state}>
          <Text style={styles.alert}>{error || 'Animal não encontrado.'}</Text>
          <Pressable
            onPress={leave}
            accessibilityRole="button"
            accessibilityLabel="Voltar à lista"
            style={({ pressed }) => [
              styles.submit,
              { backgroundColor: theme.primary, alignSelf: 'stretch', marginHorizontal: 32 },
              pressed && styles.submitPressed,
            ]}
          >
            <Text style={styles.submitText}>Voltar à lista</Text>
          </Pressable>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.section}>Informações básicas</Text>

              <TextField
                label="Nome do animal *"
                value={form.nome}
                onChangeText={updateField('nome')}
                placeholder={copy.nomePlaceholder}
                autoCapitalize="words"
                autoComplete="off"
                textContentType="none"
                maxLength={80}
                accessibilityLabel="Nome do animal"
              />

              <ChipGroup
                label="Espécie"
                required
                options={ESPECIE_OPTIONS}
                value={form.especie}
                onChange={updateField('especie')}
                accent={theme.primary}
              />

              <TextField
                label="Raça *"
                value={form.raca}
                onChangeText={updateField('raca')}
                placeholder="Ex: SRD, Labrador"
                autoCapitalize="words"
                autoComplete="off"
                textContentType="none"
                maxLength={60}
                accessibilityLabel="Raça"
              />

              <View style={styles.field}>
                <Text style={styles.label}>Idade</Text>
                <Pressable
                  onPress={() => setIdadeOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel={`Idade, ${idadeLabel}`}
                  style={styles.select}
                >
                  <Text style={[styles.selectText, form.idade === '' && styles.selectPlaceholder]}>
                    {idadeLabel}
                  </Text>
                </Pressable>
              </View>

              <ChipGroup
                label="Porte"
                required
                options={PORTE_OPTIONS}
                value={form.porte}
                onChange={updateField('porte')}
                accent={theme.primary}
              />

              <TextField
                label="Descrição *"
                value={form.descricao}
                onChangeText={updateField('descricao')}
                placeholder="Descreva o temperamento, hábitos e outras informações importantes…"
                autoCapitalize="sentences"
                autoCorrect
                autoComplete="off"
                textContentType="none"
                maxLength={200}
                multiline
                numberOfLines={5}
                accessibilityLabel="Descrição"
              />
              <Text style={styles.counter}>{form.descricao.length}/200</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.section}>Localização</Text>
              <View style={styles.row}>
                <TextField
                  label="Cidade *"
                  value={form.cidade}
                  onChangeText={updateField('cidade')}
                  placeholder="Ex: Lajeado"
                  autoCapitalize="words"
                  autoComplete="off"
                  textContentType="addressCity"
                  maxLength={60}
                  accessibilityLabel="Cidade"
                  style={styles.cidadeField}
                />
                <TextField
                  label="UF *"
                  value={form.uf}
                  onChangeText={handleUfChange}
                  placeholder="Ex: RS"
                  autoCapitalize="characters"
                  autoComplete="off"
                  textContentType="addressState"
                  maxLength={2}
                  accessibilityLabel="UF"
                  style={styles.ufField}
                />
              </View>
            </View>

            {error ? (
              <Text style={styles.alert} accessibilityRole="alert" accessibilityLiveRegion="polite">
                {error}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                onPress={() => navigation.goBack()}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel="Cancelar"
                style={({ pressed }) => [styles.cancel, pressed && styles.cancelPressed]}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel="Salvar animal"
                accessibilityState={{ disabled: submitting, busy: submitting }}
                style={({ pressed }) => [
                  styles.submit,
                  { backgroundColor: theme.primary },
                  submitting && styles.submitDisabled,
                  pressed && !submitting && styles.submitPressed,
                ]}
              >
                <Text style={styles.submitText}>{submitting ? 'Salvando…' : 'Salvar animal'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      <Modal
        visible={idadeOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIdadeOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIdadeOpen(false)} />
          <View style={styles.modalSheet} accessibilityViewIsModal>
            <Text style={styles.modalTitle}>Idade</Text>
            <ScrollView style={styles.modalList}>
              <Pressable
                onPress={() => {
                  updateField('idade')('');
                  setIdadeOpen(false);
                }}
                style={styles.modalItem}
                accessibilityRole="button"
                accessibilityLabel="Selecione"
              >
                <Text style={styles.modalItemText}>Selecione</Text>
              </Pressable>
              {idadeOptions.map((idade) => (
                <Pressable
                  key={idade}
                  onPress={() => {
                    updateField('idade')(String(idade));
                    setIdadeOpen(false);
                  }}
                  style={styles.modalItem}
                  accessibilityRole="button"
                  accessibilityLabel={labelIdadeOpcao(idade)}
                >
                  <Text style={styles.modalItemText}>{labelIdadeOpcao(idade)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.listBackground,
  },
  flex: {
    flex: 1,
  },
  top: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    minHeight: 48,
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
    fontSize: 17,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    paddingHorizontal: 20,
    marginTop: 2,
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
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.listBackground,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.surface,
  },
  select: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  selectText: {
    fontSize: 16,
    color: colors.text,
  },
  selectPlaceholder: {
    color: colors.placeholder,
  },
  counter: {
    marginTop: -8,
    textAlign: 'right',
    color: colors.muted,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  cidadeField: {
    flex: 1,
    marginBottom: 0,
  },
  ufField: {
    width: 88,
    marginBottom: 0,
  },
  alert: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancel: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelPressed: {
    opacity: 0.85,
  },
  cancelText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  submit: {
    flex: 1.2,
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitPressed: {
    opacity: 0.9,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '70%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 24,
    zIndex: 1,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  modalList: {
    paddingHorizontal: 8,
  },
  modalItem: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text,
  },
});
