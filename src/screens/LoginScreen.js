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
import { LogInIcon, MailIcon } from '../components/AuthIcons';
import PasswordField from '../components/PasswordField';
import TextField from '../components/TextField';
import { useAuth } from '../hooks/useAuth';
import { isEmailValid, MIN_SENHA } from '../services/authService';
import { colors } from '../theme/colors';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError('');

    if (!isEmailValid(email)) {
      setError('Informe um e-mail válido');
      return;
    }
    if (!senha || senha.length < MIN_SENHA) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), senha });
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
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>

          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            icon={<MailIcon />}
          />
          <PasswordField value={senha} onChangeText={setSenha} />

          <Text
            style={styles.forgot}
            accessibilityRole="text"
            accessibilityState={{ disabled: true }}
            accessibilityHint="Em breve"
          >
            Esqueceu sua senha?
          </Text>

          {error ? (
            <Text style={styles.alert} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Entrar"
            accessibilityState={{ disabled: submitting, busy: submitting }}
            style={({ pressed }) => [
              styles.submit,
              submitting ? styles.submitDisabled : null,
              pressed && !submitting ? styles.submitPressed : null,
            ]}
          >
            {submitting ? (
              <Text style={styles.submitText}>Entrando…</Text>
            ) : (
              <View style={styles.submitContent}>
                <LogInIcon />
                <Text style={styles.submitText}>Entrar</Text>
              </View>
            )}
          </Pressable>

          <Text style={styles.signupHint}>
            Ainda não tem uma conta?{' '}
            <Text
              onPress={() => navigation.navigate('Register')}
              style={styles.signupLink}
              accessibilityRole="link"
              accessibilityLabel="Cadastre-se"
            >
              Cadastre-se
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
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    color: colors.placeholder,
    fontSize: 14,
    fontWeight: '600',
    minHeight: 44,
    textAlignVertical: 'center',
  },
  alert: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
    fontSize: 14,
  },
  submit: {
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
  signupHint: {
    marginTop: 20,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});
