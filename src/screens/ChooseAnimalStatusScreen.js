import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, statusTheme } from '../theme/colors';
import { ChevronLeftIcon } from '../components/ListIcons';

export default function ChooseAnimalStatusScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  function escolher(status) {
    navigation.navigate('AnimalForm', { status });
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.back}
        >
          <ChevronLeftIcon color={colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Cadastrar animal</Text>
        <View style={styles.back} />
      </View>

      <View style={styles.body}>
        <Text style={styles.subtitle}>O animal foi encontrado ou está perdido?</Text>

        <Pressable
          onPress={() => escolher('E')}
          accessibilityRole="button"
          accessibilityLabel="Encontrei um animal"
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: statusTheme.E.primary },
            pressed && styles.cardPressed,
          ]}
        >
          <Text style={styles.cardTitle}>Encontrei um animal</Text>
          <Text style={styles.cardHint}>Alguém pode estar procurando</Text>
        </Pressable>

        <Pressable
          onPress={() => escolher('P')}
          accessibilityRole="button"
          accessibilityLabel="Perdi um animal"
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: statusTheme.P.primary },
            pressed && styles.cardPressed,
          ]}
        >
          <Text style={styles.cardTitle}>Perdi um animal</Text>
          <Text style={styles.cardHint}>Ajude a encontrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.listBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    minHeight: 52,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 14,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 6,
    lineHeight: 22,
  },
  card: {
    borderRadius: 16,
    minHeight: 88,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  cardPressed: {
    opacity: 0.88,
  },
  cardTitle: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '800',
  },
  cardHint: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    marginTop: 4,
  },
});
