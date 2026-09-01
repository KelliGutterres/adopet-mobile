import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import {
  isEmailValid,
  isPhoneValid,
  isUfValid,
  maskPhone,
  unmaskPhone,
} from '../services/authService';
import { atualizarMe } from '../services/usuariosService';
import {
  displayNomeUsuario,
  iniciaisUsuario,
  labelCidadeUsuario,
} from '../services/userLabels';
import TextField from '../components/TextField';
import { MailIcon, MapPinIcon, PhoneIcon, UserIcon } from '../components/AuthIcons';
import { ChevronLeftIcon, LogoutIcon, PencilIcon } from '../components/ListIcons';
import { colors } from '../theme/colors';

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

function formFromUsuario(usuario) {
  return {
    nome: (usuario?.nome || '').trim(),
    email: (usuario?.email || '').trim(),
    contato: usuario?.contato ? maskPhone(usuario.contato) : '',
    cidade: (usuario?.cidade?.nome || '').trim(),
    uf: (usuario?.cidade?.uf || '').trim().toUpperCase(),
  };
}

function normalizeForm(form) {
  return {
    nome: form.nome.trim(),
    email: form.email.trim().toLowerCase(),
    contato: unmaskPhone(form.contato),
    cidade: form.cidade.trim(),
    uf: form.uf.trim().toUpperCase(),
  };
}

function isFormDirty(form, snapshot) {
  const current = normalizeForm(form);
  const initial = normalizeForm(snapshot);
  return (
    current.nome !== initial.nome ||
    current.email !== initial.email ||
    current.contato !== initial.contato ||
    current.cidade !== initial.cidade ||
    current.uf !== initial.uf
  );
}

function validateProfileForm(form) {
  const current = normalizeForm(form);

  if (!current.nome) {
    return 'Informe o nome completo';
  }
  if (!isEmailValid(current.email)) {
    return 'Informe um e-mail válido';
  }
  if (!current.contato) {
    return 'Informe o contato';
  }
  if (!isPhoneValid(current.contato)) {
    return 'Informe um contato válido';
  }
  if (!current.cidade) {
    return 'Informe a cidade';
  }
  if (!isUfValid(current.uf)) {
    return 'Informe a UF (2 letras, ex.: RS)';
  }
  return '';
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, logout, atualizarPerfil } = useAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => formFromUsuario(usuario));
  const [snapshot, setSnapshot] = useState(() => formFromUsuario(usuario));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const nomeExibicao = displayNomeUsuario(usuario);
  const iniciais = iniciaisUsuario(nomeExibicao);
  const nome = (usuario?.nome || '').trim();
  const email = (usuario?.email || '').trim();
  const contato = usuario?.contato ? maskPhone(usuario.contato) : '';
  const cidade = labelCidadeUsuario(usuario?.cidade);
  const dirty = useMemo(() => isFormDirty(form, snapshot), [form, snapshot]);

  const exitEdit = useCallback(() => {
    setEditing(false);
    setError('');
    setSubmitting(false);
  }, []);

  const requestExitEdit = useCallback(() => {
    if (submitting) {
      return;
    }
    if (!isFormDirty(form, snapshot)) {
      exitEdit();
      return;
    }
    Alert.alert(
      'Descartar alterações?',
      'As alterações não salvas serão perdidas.',
      [
        { text: 'Continuar editando', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: exitEdit },
      ],
    );
  }, [exitEdit, form, snapshot, submitting]);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (event) => {
      if (!editing) {
        return;
      }
      event.preventDefault();
      requestExitEdit();
    });
  }, [editing, navigation, requestExitEdit]);

  function handleHeaderBack() {
    if (editing) {
      requestExitEdit();
      return;
    }
    navigation.goBack();
  }

  function handleStartEdit() {
    const initial = formFromUsuario(usuario);
    setForm(initial);
    setSnapshot(initial);
    setError('');
    setEditing(true);
  }

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
    if (submitting) {
      return;
    }
    setError('');
    if (!dirty) {
      exitEdit();
      return;
    }

    const message = validateProfileForm(form);
    if (message) {
      setError(message);
      return;
    }

    const current = normalizeForm(form);
    setSubmitting(true);
    try {
      const result = await atualizarMe({
        nome: current.nome,
        email: current.email,
        contato: current.contato,
        cidade: { nome: current.cidade, uf: current.uf },
      });
      await atualizarPerfil(result.usuario);
      exitEdit();
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

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={[styles.top, { paddingTop: insets.top + 4 }]}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <Pressable
              onPress={handleHeaderBack}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              style={styles.headerBtn}
            >
              <ChevronLeftIcon color={colors.surface} size={22} />
            </Pressable>
            <View style={styles.headerBtn} />
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {editing ? 'Editar perfil' : 'Perfil'}
          </Text>
          <View style={styles.headerSide}>
            {editing ? (
              <View style={styles.headerBtn} />
            ) : (
              <Pressable
                onPress={handleStartEdit}
                accessibilityRole="button"
                accessibilityLabel="Editar perfil"
                style={styles.headerBtn}
              >
                <PencilIcon color={colors.surface} size={22} />
              </Pressable>
            )}
            <Pressable
              onPress={() => logout()}
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
              style={styles.headerBtn}
            >
              <LogoutIcon color={colors.danger} size={22} />
            </Pressable>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: Math.max(insets.bottom, 16) + 16 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{iniciais}</Text>
            </View>
            <Text style={styles.name}>{nomeExibicao}</Text>
            <Text style={styles.role}>Usuário</Text>
          </View>

          {editing ? (
            <View style={styles.card}>
              <TextField
                label="Nome"
                value={form.nome}
                onChangeText={updateField('nome')}
                placeholder="Digite seu nome completo"
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                maxLength={150}
                icon={<UserIcon />}
              />
              <TextField
                label="E-mail"
                value={form.email}
                onChangeText={updateField('email')}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                icon={<MailIcon />}
              />
              <TextField
                label="Contato"
                value={form.contato}
                onChangeText={(value) =>
                  setForm((current) => ({ ...current, contato: maskPhone(value) }))
                }
                placeholder="(51) 99999-9999"
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                maxLength={16}
                icon={<PhoneIcon />}
              />
              <View style={styles.row}>
                <TextField
                  label="Cidade"
                  value={form.cidade}
                  onChangeText={updateField('cidade')}
                  placeholder="Ex.: Lajeado"
                  autoCapitalize="words"
                  autoComplete="off"
                  textContentType="addressCity"
                  maxLength={60}
                  icon={<MapPinIcon />}
                  style={styles.cidadeField}
                />
                <TextField
                  label="UF"
                  value={form.uf}
                  onChangeText={handleUfChange}
                  placeholder="Ex.: RS"
                  autoCapitalize="characters"
                  autoComplete="off"
                  textContentType="addressState"
                  maxLength={2}
                  style={styles.ufField}
                />
              </View>

              {error ? (
                <Text style={styles.alert} accessibilityRole="alert">
                  {error}
                </Text>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel="Salvar"
                accessibilityState={{ disabled: submitting, busy: submitting }}
                style={({ pressed }) => [
                  styles.submit,
                  submitting ? styles.submitDisabled : null,
                  pressed && !submitting ? styles.submitPressed : null,
                ]}
              >
                <Text style={styles.submitText}>{submitting ? 'Salvando…' : 'Salvar'}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.section}>Informações</Text>
              <InfoRow label="Nome" value={nome || nomeExibicao} />
              <InfoRow label="E-mail" value={email} />
              <InfoRow label="Contato" value={contato} />
              <InfoRow label="Cidade" value={cidade} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerSide: {
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
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
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  identity: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  role: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  cidadeField: {
    flex: 1,
  },
  ufField: {
    width: 88,
  },
  alert: {
    marginTop: 4,
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
    fontSize: 14,
  },
  submit: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitPressed: {
    backgroundColor: colors.primaryHover,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
