import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
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
import { LockIcon, MailIcon } from '../components/AuthIcons';
import PasswordField from '../components/PasswordField';
import TextField from '../components/TextField';
import { isEmailValid, MIN_SENHA, redefinirSenhaUsuario } from '../services/authService';
import { colors } from '../theme/colors';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState(() => String(route.params?.email || '').trim());
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const next = String(route.params?.email || '').trim();
      if (next) {
        setEmail(next);
      }
    }, [route.params?.email]),
  );

  function goToLogin(extra = {}) {
    const trimmed = email.trim();
    navigation.navigate('Login', {
      ...(trimmed ? { email: trimmed } : {}),
      ...extra,
    });
  }

  async function handleSubmit() {
    setError('');

    const emailTrim = email.trim();

    if (!isEmailValid(emailTrim)) {
      setError('Informe um e-mail válido');
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
      await redefinirSenhaUsuario({ email: emailTrim, senha });
      navigation.navigate('Login', {
        senhaAtualizada: true,
        email: emailTrim,
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
          <Text style={styles.title}>Esqueceu a senha?</Text>
          <Text style={styles.subtitle}>
            Informe o e-mail da conta e escolha uma nova senha
          </Text>

          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            icon={<MailIcon />}
          />
          <PasswordField
            label="Nova senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite a nova senha"
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <PasswordField
            label="Confirmar senha"
            value={confirmacao}
            onChangeText={setConfirmacao}
            placeholder="Confirme a nova senha"
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
            accessibilityLabel="Redefinir senha"
            accessibilityState={{ disabled: submitting, busy: submitting }}
            style={({ pressed }) => [
              styles.submit,
              submitting ? styles.submitDisabled : null,
              pressed && !submitting ? styles.submitPressed : null,
            ]}
          >
            {submitting ? (
              <Text style={styles.submitText}>Redefinindo…</Text>
            ) : (
              <View style={styles.submitContent}>
                <LockIcon color={colors.surface} />
                <Text style={styles.submitText}>Redefinir senha</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => goToLogin()}
            accessibilityRole="link"
            accessibilityLabel="Voltar ao login"
            style={styles.backHit}
          >
            <Text style={styles.backLink}>Voltar ao login</Text>
          </Pressable>
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
  backHit: {
    marginTop: 20,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
