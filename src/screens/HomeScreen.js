import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const { usuario, logout } = useAuth();
  const nome = usuario?.nome || usuario?.email || 'usuário';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {nome}</Text>
      <Text style={styles.body}>
        Você está autenticado. A listagem de animais entra na próxima fatia.
      </Text>
      <Pressable
        onPress={logout}
        accessibilityRole="button"
        accessibilityLabel="Sair"
        style={({ pressed }) => [styles.logout, pressed ? styles.logoutPressed : null]}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 24,
  },
  logout: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
    justifyContent: 'center',
  },
  logoutPressed: {
    backgroundColor: colors.primaryHover,
  },
  logoutText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 15,
  },
});
