import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export class ImagePickError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ImagePickError';
    this.code = code;
  }
}

const PICKER_OPTIONS = {
  mediaTypes: ['images'],
  allowsMultipleSelection: false,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
};

function isGranted(status) {
  return status === 'granted' || status === 'limited';
}

async function ensurePermission(source) {
  if (source === 'camera') {
    const current = await ImagePicker.getCameraPermissionsAsync();
    const result = current.granted ? current : await ImagePicker.requestCameraPermissionsAsync();
    if (!isGranted(result.status)) {
      throw new ImagePickError(
        'Permita o acesso à câmera nas configurações para fotografar o animal.',
        'denied-camera',
      );
    }
    return;
  }

  const current = await ImagePicker.getMediaLibraryPermissionsAsync();
  const result = current.granted || current.accessPrivileges === 'limited'
    ? current
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!isGranted(result.status) && result.accessPrivileges !== 'limited') {
    throw new ImagePickError(
      'Permita o acesso às fotos nas configurações para escolher a imagem do animal.',
      'denied-library',
    );
  }
}

async function convertToJpeg(uri) {
  const result = await manipulateAsync(uri, [], {
    compress: 0.7,
    format: SaveFormat.JPEG,
  });
  if (!result?.uri) {
    throw new ImagePickError('Não foi possível preparar a foto.', 'invalid');
  }
  return result.uri;
}

async function assertMaxSize(uri) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    if (blob.size > MAX_IMAGE_BYTES) {
      throw new ImagePickError('imagem deve ter no máximo 8 MB', 'invalid');
    }
  } catch (err) {
    if (err instanceof ImagePickError) {
      throw err;
    }
  }
}

export async function pickAnimalJpeg(source) {
  try {
    await ensurePermission(source);

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
        : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);

    if (result.canceled || !result.assets?.[0]?.uri) {
      throw new ImagePickError('canceled', 'canceled');
    }

    const jpegUri = await convertToJpeg(result.assets[0].uri);
    await assertMaxSize(jpegUri);
    return jpegUri;
  } catch (err) {
    if (err instanceof ImagePickError) {
      throw err;
    }
    const fallback =
      source === 'camera'
        ? 'Não foi possível abrir a câmera.'
        : 'Não foi possível abrir a galeria.';
    throw new ImagePickError(err?.message || fallback, 'invalid');
  }
}

export function showPhotoSourceAlert({ onCamera, onLibrary }) {
  Alert.alert('Foto do animal', undefined, [
    { text: 'Tirar foto', onPress: onCamera },
    { text: 'Galeria', onPress: onLibrary },
    { text: 'Cancelar', style: 'cancel' },
  ]);
}

export function showPermissionDeniedAlert(code) {
  if (code === 'denied-camera') {
    Alert.alert(
      'Câmera indisponível',
      'Permita o acesso à câmera nas configurações para fotografar o animal.',
    );
    return;
  }
  if (code === 'denied-library') {
    Alert.alert(
      'Galeria indisponível',
      'Permita o acesso às fotos nas configurações para escolher a imagem do animal.',
    );
  }
}
