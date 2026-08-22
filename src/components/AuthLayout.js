import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import PawLogo from './PawLogo';
import PetsFooter from './PetsFooter';

export default function AuthLayout({ children }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.page, { paddingTop: insets.top + 12 }]}>
      <View style={styles.paws} pointerEvents="none">
        <View style={[styles.paw, { top: 24, left: 18, opacity: 0.12, transform: [{ rotate: '-18deg' }] }]}>
          <PawLogo size={42} />
        </View>
        <View style={[styles.paw, { top: 8, right: 28, opacity: 0.1, transform: [{ rotate: '22deg' }] }]}>
          <PawLogo size={36} />
        </View>
        <View style={[styles.paw, { top: 88, right: 12, opacity: 0.08, transform: [{ rotate: '-8deg' }] }]}>
          <PawLogo size={28} />
        </View>
      </View>

      <View style={styles.brand}>
        <PawLogo size={78} />
        <Text style={styles.name}>AdoPet</Text>
        <Text style={styles.slogan}>Conectando pets a um novo começo 💜</Text>
      </View>

      <View style={styles.art}>
        <PetsFooter />
      </View>

      <View style={[styles.card, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  paws: {
    ...StyleSheet.absoluteFillObject,
  },
  paw: {
    position: 'absolute',
  },
  brand: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  name: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.6,
  },
  slogan: {
    marginTop: 4,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
  },
  art: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: -18,
    zIndex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    zIndex: 2,
    overflow: 'hidden',
  },
});
