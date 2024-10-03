import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react';
// import StoreLocation from '../../assets/StoreLocation.svg';
import Document from '../assets/Documents.svg';
import NewBid from '../assets/NewBid.svg';
import CameraIcon from '../assets/Camera.svg';
import Gallery from '../assets/Gallerys.svg';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { launchCamera } from 'react-native-image-picker';
import { manipulateAsync } from "expo-image-manipulator";
import { Camera } from "expo-camera";


const Attachment = ({ setAttachmentScreen, setCameraScreen, user, messages, setMessages,setErrorModal}) => {
    const requestInfo = useSelector(state => state.requestData.requestInfo);

    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState("");
    const { height } = Dimensions.get("window");
    // console.log("height: " + height);


    const pickDocument = async () => {
        const MAX_FILE_SIZE_MB = 2; // Maximum file size in MB
        const DOCUMENT_MIME_TYPES = [
            'application/pdf',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*', // Allow all file types initially
        });

        if (!result.canceled) {
            // const fileInfo = await RNFS.stat(result.uri.replace('file://', ''));

            
            const fileSizeMB = parseFloat(result.assets[0].size) / (1e6); // Convert bytes to MB
            console.log(fileSizeMB);
            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                setErrorModal(true);
                setAttachmentScreen(false);
                console.error(
                    'File Size Limit Exceeded',
                    `Please select a file smaller than ${MAX_FILE_SIZE_MB}MB`
                );
            }
            else {
                navigation.navigate('send-document', { result, messages, setMessages });
            }
        }

        return null;

    }

    const [hasCameraPermission, setHasCameraPermission] = useState(null);

  const [camera, setCamera] = useState(null);

  const getCameraPermission= async()=>{
    const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    
  }
  useEffect(() => {
    getCameraPermission();
      
  }, []);

  

  const takePicture = async () => {
    const options = {
      mediaType: "photo",
      saveToPhotos: true,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
       
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      
      } else {
        try {
          const newImageUri = response.assets[0].uri;
          const compressedImage = await manipulateAsync(
            newImageUri,
            [{ resize: { width: 600, height: 800 } }],
            { compress: 0.5, format: "jpeg", base64: true }
          );
          // await getImageUrl(compressedImage);
          setImageUri(compressedImage.uri);
          if(compressedImage)
            navigation.navigate('camera', { imageUri:compressedImage.uri, user, messages, setMessages })
        } catch (error) {
          console.error("Error processing image: ", error);
        }
      }
    });
  };

  const pickImage = async () => {
    console.log("object", "hii");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      base64: true,
      quality: 1,
    });

    console.log("pickImage", "result");
    
    if (!result.canceled) {
      // getImageUrl(result.assets[0]);
      const newImageUri = result.assets[0].uri;
      const compressedImage = await manipulateAsync(
        newImageUri,
        [{ resize: { width: 600, height: 800 } }],
        { compress: 0.8, format: "jpeg", base64: true }
      );
      // await getImageUrl(compressedImage);
      setImageUri(compressedImage.uri);
      if(compressedImage)
        navigation.navigate('camera', { imageUri:compressedImage.uri, user, messages, setMessages })
    }
  };

 
  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

//   navigation.navigate('camera', { data: { openCamera: true }, user, messages, setMessages })
// navigation.navigate('camera', { data: { openCamera: false }, user, messages, setMessages })

    return (
        <SafeAreaView style={styles.attachments} className="flex flex-col  absolute top-0 bottom-0 left-0 right-0  z-50 h-screen" >
            <TouchableOpacity onPress={() => { setAttachmentScreen(false) }} >
                <View className=" w-screen h-4/5  bg-transparent" >
                </View>
            </TouchableOpacity>
            <View className="bg-white py-[20px] h-1/5 gap-5" >
                <View className="flex-row justify-evenly items-center ">
                    <TouchableOpacity onPress={() => { setAttachmentScreen(false); pickDocument() }}>
                        <View className="items-center">
                            <Document />
                            <Text style={{ fontFamily: "Poppins-Regular" }}>Document</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {takePicture(); setAttachmentScreen(false);  }}>
                        <View className="items-center">
                            <CameraIcon />
                            <Text style={{ fontFamily: "Poppins-Regular" }}>Camera</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {pickImage(); setAttachmentScreen(false);  }}>
                        <View className="items-center">
                            <Gallery />
                            <Text style={{ fontFamily: "Poppins-Regular" }}>Gallery</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = {
    attachments: {
        //  height:height,
        zIndex: 100, // Ensure the overlay is on top
    },
};
export default Attachment