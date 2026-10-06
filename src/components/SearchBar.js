import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { CameraIcon, SearchIcon } from './ListIcons';

export default function SearchBar({
  value,
  onChangeText,
  showPhotoSearch = false,
  onPhotoSearch,
}) {
  const photoSearchEnabled = Boolean(onPhotoSearch);

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
      {showPhotoSearch ? (
        <Pressable
          disabled={!photoSearchEnabled}
          onPress={onPhotoSearch}
          accessibilityRole="button"
          accessibilityLabel="Buscar por foto"
          accessibilityHint={photoSearchEnabled ? 'Escolher foto da câmera ou galeria' : 'Em breve'}
          accessibilityState={{ disabled: !photoSearchEnabled }}
          style={[styles.photoSearch, !photoSearchEnabled && styles.photoSearchDisabled]}
        >
          <CameraIcon color={colors.text} size={18} />
        </Pressable>
      ) : null}
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
  photoSearch: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoSearchDisabled: {
    opacity: 0.7,
  },
});
