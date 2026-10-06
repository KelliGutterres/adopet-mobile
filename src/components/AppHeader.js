import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotificacoes } from '../context/NotificacoesContext';
import { useAuth } from '../hooks/useAuth';
import { displayNomeUsuario, iniciaisUsuario } from '../services/userLabels';
import { colors } from '../theme/colors';
import PawLogo from './PawLogo';
import { BellIcon } from './ListIcons';

export default function AppHeader({ primaryColor }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { usuario } = useAuth();
  const { naoLidas } = useNotificacoes();
  const iniciais = iniciaisUsuario(displayNomeUsuario(usuario));
  const rotulo =
    naoLidas > 0
      ? `Notificações, ${naoLidas} não ${naoLidas === 1 ? 'lida' : 'lidas'}`
      : 'Notificações';

  return (
    <View style={[styles.wrap, { backgroundColor: primaryColor, paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        <View style={styles.brand}>
          <PawLogo size={28} color={colors.surface} innerColor={primaryColor} />
          <Text style={styles.logoText}>AdoPet</Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            accessibilityRole="button"
            accessibilityLabel={rotulo}
            style={styles.action}
          >
            <BellIcon color={colors.surface} size={22} />
            {naoLidas > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{naoLidas > 9 ? '9+' : String(naoLidas)}</Text>
              </View>
            ) : null}
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
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: '800',
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
