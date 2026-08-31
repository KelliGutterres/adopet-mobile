import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, statusTheme } from '../theme/colors';
import {
  FoundTabIcon,
  HeartIcon,
  LostTabIcon,
  PlusIcon,
  SimilarityTabIcon,
} from './ListIcons';

const ITEMS = [
  { key: 'Perdidos', label: 'Perdidos', Icon: LostTabIcon },
  { key: 'Encontrados', label: 'Encontrados', Icon: FoundTabIcon },
  { key: 'Cadastrar', label: 'Cadastrar', fab: true },
  { key: 'Adocao', label: 'Adoção', Icon: HeartIcon },
  { key: 'Similaridade', label: 'Similaridade', Icon: SimilarityTabIcon, disabled: true },
];

function themeForRoute(routeName) {
  if (routeName === 'Adocao') {
    return statusTheme.A;
  }
  if (routeName === 'Encontrados') {
    return statusTheme.E;
  }
  return statusTheme.P;
}

export default function BottomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const focusedRoute = state.routes[state.index]?.name;
  const fabColor = themeForRoute(focusedRoute).primary;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {ITEMS.map((item) => {
        if (item.fab) {
          return (
            <View key={item.key} style={styles.slot}>
              <Pressable
                onPress={() => {
                  navigation.getParent()?.navigate('ChooseAnimalStatus');
                }}
                accessibilityRole="button"
                accessibilityLabel="Cadastrar animal"
                style={[styles.fab, { backgroundColor: fabColor }]}
              >
                <PlusIcon color={colors.surface} size={26} />
              </Pressable>
              <Text style={styles.fabLabel}>{item.label}</Text>
            </View>
          );
        }

        if (item.disabled) {
          return (
            <Pressable
              key={item.key}
              disabled
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityHint="Em breve"
              accessibilityState={{ disabled: true }}
              style={styles.slot}
            >
              <item.Icon color={colors.placeholder} size={22} />
              <Text style={[styles.label, styles.labelDisabled]} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          );
        }

        const routeIndex = state.routes.findIndex((route) => route.name === item.key);
        const route = state.routes[routeIndex];
        const focused = state.index === routeIndex;
        const color = focused ? themeForRoute(item.key).primary : colors.muted;

        return (
          <Pressable
            key={item.key}
            onPress={() => {
              if (!route || focused) {
                return;
              }
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) {
                navigation.navigate(item.key);
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: focused }}
            style={styles.slot}
          >
            <item.Icon color={color} size={22} />
            <Text style={[styles.label, { color }]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    overflow: 'visible',
    paddingTop: 16,
    paddingHorizontal: 4,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    minHeight: 52,
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelDisabled: {
    color: colors.placeholder,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    marginBottom: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
});
