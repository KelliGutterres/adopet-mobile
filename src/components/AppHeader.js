import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { displayNomeUsuario, iniciaisUsuario } from '../services/userLabels';
import { colors } from '../theme/colors';
import PawLogo from './PawLogo';
import { BellIcon } from './ListIcons';

export default function AppHeader({ primaryColor }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { usuario } = useAuth();
  const iniciais = iniciaisUsuario(displayNomeUsuario(usuario));

  return (
    <View style={[styles.wrap, { backgroundColor: primaryColor, paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        <View style={styles.brand}>
          <PawLogo size={28} color={colors.surface} innerColor={primaryColor} />
          <Text style={styles.logoText}>AdoPet</Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityLabel="Notificações"
            accessibilityHint="Em breve"
            accessibilityState={{ disabled: true }}
            style={[styles.action, styles.bell]}
          >
            <BellIcon color={colors.surface} size={22} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button"
            accessibilityLabel="Perfil"
            style={styles.action}
          >
            <View style={styles.avatar}>
              <Text style={[styles.avatarText, { color: primaryColor }]}>{iniciais}</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    opacity: 0.9,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
