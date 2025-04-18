import tw from '@/tailwind';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, PixelRatio, StyleSheet, Text, TouchableOpacity, View, Modal, Image, ScrollView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import * as ImagePicker from 'expo-image-picker';

export default function TabTwoScreen() {
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [take, setTake] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);
  const [open, setOpen] = useState(false);
  const modalizeRef = useRef<Modalize>(null);

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: false,
    });
  
    if (!result.canceled) {
      setTake(
        (prev) => [...prev, result.assets[0].uri],
      );
      setOpen(true);
    }
  };
  

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true,
        skipProcessing: false,
      });
      setTake(
        (prev) => [...prev, photo?.uri || ''],
      );
      setOpen(true);
    }
  };

  return (
    <View style={tw`flex-1`}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
        flash={facing === 'front' ? 'on' : 'off'}
        mirror={facing === 'front'}
        mode="picture"
        videoQuality="1080p"
      />
      <View style={tw`flex flex-row justify-center items-center absolute bottom-0 mb-10 w-full h-16 gap-4`}>
        <TouchableOpacity onPress={() => modalizeRef.current?.open()} hitSlop={20}>
          <Text style={tw`bg-red-400 p-3 rounded h-12 w-full text-center`}>Galeria</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraFacing} hitSlop={20}>
          <Text style={tw`bg-red-400 p-3 rounded h-12 w-full text-center`}>Virar camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={captureImage} hitSlop={20}>
          <Text style={tw`bg-red-400 p-3 rounded h-12 w-full text-center`}>Capture Image</Text>
        </TouchableOpacity>
      </View>

      {take && (
        <Modal
          visible={open}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setOpen(false)}
        >
          <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
            <Image
              source={{ uri: take[take.length - 1] }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
            <TouchableOpacity style={tw`absolute bottom-10 bg-red-400 p-2 rounded`} onPress={() => setOpen(false)}>
              <Text style={tw`text-white text-lg`}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

<Modalize ref={modalizeRef} snapPoint={500} modalStyle={tw`bg-white rounded-t-2xl`} handleStyle={tw`bg-gray-300 w-12 h-1.5 rounded-full mt-2`}>
  <ScrollView style={tw`flex-1 p-4`}>

    {/* Tabs: Fotos | Vídeos | Álbum */}
    <View style={tw`flex-row justify-around items-center mb-4`}>
      <TouchableOpacity style={tw`px-4 py-2 bg-blue-500 rounded-full`}>
        <Text style={tw`text-white font-semibold`}>Fotos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`px-4 py-2 bg-gray-200 rounded-full`} onPress={() => alert('Vídeos em breve')}>
        <Text style={tw`text-gray-800 font-semibold`}>Vídeos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`px-4 py-2 bg-gray-200 rounded-full`} onPress={pickImageFromGallery}>
        <Text style={tw`text-gray-800 font-semibold`}>Álbum</Text>
      </TouchableOpacity>
    </View>

    {/* Imagens */}
    <View style={tw`flex-row flex-wrap justify-start`}>
      {take.filter(Boolean).map((item, index) => (
        <View key={index} style={tw`w-[31%] aspect-square bg-gray-100 m-[1%] rounded-xl overflow-hidden`}>
          <Image
            source={{ uri: item }}
            key={index}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>
      ))}
    </View>

  </ScrollView>
</Modalize>

    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
