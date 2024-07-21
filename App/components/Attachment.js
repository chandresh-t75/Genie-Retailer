import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native'
import React, { useState } from 'react';
// import StoreLocation from '../../assets/StoreLocation.svg';
import Document from '../assets/Documents.svg';
import NewBid from '../assets/NewBid.svg';
import Camera from '../assets/Camera.svg';
import Gallery from '../assets/Gallerys.svg';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
// import { socket } from '../../utils/scoket.io/socket';

const Attachment = ({ setAttachmentScreen, setCameraScreen, user, messages, setMessages,setErrorModal}) => {
    const requestInfo = useSelector(state => state.requestData.requestInfo);

    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState("");
    const { height } = Dimensions.get("window");
    // console.log("height: " + height);


    const getImageUrl = async (image) => {


        let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/kumarvivek/image/upload';

        let base64Img = `data:image/jpg;base64,${image.base64}`;

        let data = {
            "file": base64Img,
            "upload_preset": "CulturTap",
        }

        // console.log('base64', data);
        fetch(CLOUDINARY_URL, {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        }).then(async r => {
            let data = await r.json()

            // setPhoto(data.url);
            const imgUri = data.secure_url;
            if (imgUri) {

                setImageUri(imgUri);
                // sendAttachment;
            }
            console.log('dataImg', data.secure_url);
            // return data.secure_url;
        }).catch(err => console.log(err));

    };

    // const pickImage = async () => {
    //     console.log("object", "hii");
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         base64: true,
    //         quality: 1,
    //     });

    //     console.log('pickImage', "result");
    //     if (!result.canceled) {
    //         // setImage(result.assets[0].uri);
    //         // console.log(object)
    //         await getImageUrl(result.assets[0]);

    //     }
    // };

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

                    <TouchableOpacity onPress={() => { setAttachmentScreen(false); navigation.navigate('camera', { data: { openCamera: true }, user, messages, setMessages }) }}>
                        <View className="items-center">
                            <Camera />
                            <Text style={{ fontFamily: "Poppins-Regular" }}>Camera</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setAttachmentScreen(false); navigation.navigate('camera', { data: { openCamera: false }, user, messages, setMessages }) }}>
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