import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

export type PickedImage = { uri: string; width: number; height: number };

const options: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  quality: 0.9,
  exif: false,
};

function toPicked(res: ImagePicker.ImagePickerResult): PickedImage | null {
  if (res.canceled || !res.assets?.[0]) return null;
  const a = res.assets[0];
  return { uri: a.uri, width: a.width, height: a.height };
}

export async function takePhoto(): Promise<PickedImage | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    Alert.alert(
      'Kamera izni gerekli',
      'Eserin fotoğrafını çekebilmek için kamera iznine ihtiyacımız var.',
      perm.canAskAgain
        ? [{ text: 'Tamam' }]
        : [
            { text: 'Vazgeç', style: 'cancel' },
            { text: 'Ayarları Aç', onPress: () => Linking.openSettings() },
          ],
    );
    return null;
  }
  return toPicked(await ImagePicker.launchCameraAsync(options));
}

export async function pickFromGallery(): Promise<PickedImage | null> {
  return toPicked(await ImagePicker.launchImageLibraryAsync(options));
}
