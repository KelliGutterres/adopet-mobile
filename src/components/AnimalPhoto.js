import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CameraIcon } from './ListIcons';
import { iniciaisNome } from '../services/animalLabels';

export default function AnimalPhoto({
  uri,
  nome = '',
  theme,
  size = 72,
  borderRadius = 12,
  showCameraFallback = false,
  fill = false,
  style,
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(uri) && !failed;
  const initials = iniciaisNome(nome);
  const iconSize = fill ? 64 : Math.round(size * 0.36);
  const fontSize = fill ? 64 : Math.round(size * 0.34);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  return (
    <View
      style={[
        styles.wrap,
        fill
          ? { width: '100%', aspectRatio: 1, borderRadius, backgroundColor: theme.chipBg }
          : { width: size, height: size, borderRadius, backgroundColor: theme.chipBg },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : showCameraFallback ? (
        <CameraIcon color={theme.primary} size={iconSize} />
      ) : (
        <Text style={[styles.initials, { color: theme.primary, fontSize }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '800',
  },
});
