import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AuthLayout from '../components/AuthLayout';
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  UserPlusIcon,
} from '../components/AuthIcons';
import PasswordField from '../components/PasswordField';
import TextField from '../components/TextField';
import { useAuth } from '../hooks/useAuth';
import {
  isEmailValid,
  isPhoneValid,
  isUfValid,
  maskPhone,
  MIN_SENHA,
  unmaskPhone,
} from '../services/authService';
import { colors } from '../theme/colors';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [contato, setContato] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleUfChange(value) {
    setUf(value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase());
  }

  async function handleSubmit() {
    setError('');

    const nomeTrim = nome.trim();
    const cidadeTrim = cidade.trim();
    const ufNorm = uf.trim().toUpperCase();

    if (!nomeTrim) {
      setError('Informe o nome completo');
      return;
    }
    if (!isEmailValid(email)) {
      setError('Informe um e-mail válido');
      return;
    }
    if (!unmaskPhone(contato)) {
      setError('Informe o contato');
      return;
    }
    if (!isPhoneValid(contato)) {
      setError('Informe um contato válido');
      return;
    }
    if (!cidadeTrim) {
      setError('Informe a cidade');
      return;
    }
    if (!isUfValid(ufNorm)) {
      setError('Informe a UF (2 letras, ex.: RS)');
      return;
    }
    if (!senha || senha.length < MIN_SENHA) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (senha !== confirmacao) {
      setError('As senhas não coincidem');
      return;
    }

    setSubmitting(true);
    try {
      await cadastrar({
        nome: nomeTrim,
        email: email.trim(),
        senha,
        contato: unmaskPhone(contato),
        cidade: { nome: cidadeTrim, uf: ufNorm },
      });
    } catch (err) {
      setError(err.message || 'Erro na requisição');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Preencha os dados abaixo para se cadastrar</Text>

          <TextField
            label="Nome completo"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome completo"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            maxLength={150}
            icon={<UserIcon />}
          />
          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            icon={<MailIcon />}
          />
          <TextField
            label="Contato"
            value={contato}
            onChangeText={(value) => setContato(maskPhone(value))}
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
              value={cidade}
              onChangeText={setCidade}
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
              value={uf}
              onChangeText={handleUfChange}
              placeholder="Ex.: RS"
              autoCapitalize="characters"
              autoComplete="off"
              textContentType="addressState"
              maxLength={2}
              style={styles.ufField}
            />
          </View>
          <PasswordField
            value={senha}
            onChangeText={setSenha}
            placeholder="Crie uma senha"
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <PasswordField
            label="Confirmar senha"
            value={confirmacao}
            onChangeText={setConfirmacao}
            placeholder="Confirme sua senha"
            autoComplete="new-password"
            textContentType="newPassword"
          />

          {error ? (
            <Text style={styles.alert} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar"
            accessibilityState={{ disabled: submitting, busy: submitting }}
            style={({ pressed }) => [
              styles.submit,
              submitting ? styles.submitDisabled : null,
              pressed && !submitting ? styles.submitPressed : null,
            ]}
          >
            {submitting ? (
              <Text style={styles.submitText}>Cadastrando…</Text>
            ) : (
              <View style={styles.submitContent}>
                <UserPlusIcon />
                <Text style={styles.submitText}>Cadastrar</Text>
              </View>
            )}
          </Pressable>

          <Text style={styles.loginHint}>
            Já tem uma conta?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={styles.loginLink}
              accessibilityRole="link"
              accessibilityLabel="Entrar"
            >
              Entrar
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
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
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
    fontSize: 14,
  },
  submit: {
    marginTop: 8,
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
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  loginHint: {
    marginTop: 20,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});
