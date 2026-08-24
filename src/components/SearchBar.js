import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { FunnelIcon, SearchIcon } from './ListIcons';

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <SearchIcon color={colors.placeholder} size={18} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Buscar por nome, raça ou localização..."
          placeholderTextColor={colors.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Buscar animais"
          underlineColorAndroid="transparent"
          style={styles.input}
        />
      </View>
      <Pressable
        disabled
        accessibilityRole="button"
        accessibilityLabel="Filtros"
        accessibilityHint="Em breve"
        accessibilityState={{ disabled: true }}
        style={styles.filters}
      >
        <FunnelIcon color={colors.text} size={16} />
        <Text style={styles.filtersText}>Filtros</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 8,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    minHeight: 44,
    opacity: 0.7,
  },
  filtersText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
});
