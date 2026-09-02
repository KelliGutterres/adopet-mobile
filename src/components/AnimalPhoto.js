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
  style,
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(uri) && !failed;
  const initials = iniciaisNome(nome);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: theme.chipBg,
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={[styles.image, { borderRadius }]}
          resizeMode="cover"
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : showCameraFallback ? (
        <CameraIcon color={theme.primary} size={Math.round(size * 0.36)} />
      ) : (
        <Text style={[styles.initials, { color: theme.primary, fontSize: Math.round(size * 0.34) }]}>
          {initials}
        </Text>
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
