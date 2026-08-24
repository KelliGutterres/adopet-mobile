import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import PawLogo from './PawLogo';
import { BellIcon } from './ListIcons';

export default function AppHeader({ primaryColor }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { backgroundColor: primaryColor, paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        <View style={styles.brand}>
          <PawLogo size={28} color={colors.surface} innerColor={primaryColor} />
          <Text style={styles.logoText}>AdoPet</Text>
        </View>
        <Pressable
          disabled
          accessibilityRole="button"
          accessibilityLabel="Notificações"
          accessibilityHint="Em breve"
          accessibilityState={{ disabled: true }}
          style={styles.bell}
        >
          <BellIcon color={colors.surface} size={22} />
        </Pressable>
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
  bell: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
});
