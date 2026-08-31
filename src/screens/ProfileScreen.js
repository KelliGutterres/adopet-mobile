import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { maskPhone } from '../services/authService';
import {
  displayNomeUsuario,
  iniciaisUsuario,
  labelCidadeUsuario,
} from '../services/userLabels';
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

export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, logout } = useAuth();

  const nomeExibicao = displayNomeUsuario(usuario);
  const iniciais = iniciaisUsuario(nomeExibicao);
  const nome = (usuario?.nome || '').trim();
  const email = (usuario?.email || '').trim();
  const contato = usuario?.contato ? maskPhone(usuario.contato) : '';
  const cidade = labelCidadeUsuario(usuario?.cidade);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={[styles.top, { paddingTop: insets.top + 4 }]}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              style={styles.headerBtn}
            >
              <ChevronLeftIcon color={colors.surface} size={22} />
            </Pressable>
            <View style={styles.headerBtn} />
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Perfil
          </Text>
          <View style={styles.headerSide}>
            <Pressable
              disabled
              accessibilityRole="button"
              accessibilityLabel="Editar perfil"
              accessibilityHint="Em breve"
              accessibilityState={{ disabled: true }}
              style={[styles.headerBtn, styles.headerBtnDisabled]}
            >
              <PencilIcon color={colors.surface} size={22} />
            </Pressable>
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

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 16) + 16 },
        ]}
      >
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>
          <Text style={styles.name}>{nomeExibicao}</Text>
          <Text style={styles.role}>Usuário</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Informações</Text>
          <InfoRow label="Nome" value={nome || nomeExibicao} />
          <InfoRow label="E-mail" value={email} />
          <InfoRow label="Contato" value={contato} />
          <InfoRow label="Cidade" value={cidade} />
        </View>
      </ScrollView>
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
  headerBtnDisabled: {
    opacity: 0.55,
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
});
