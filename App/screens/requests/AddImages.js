import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react';
import ArrowRight from '../../assets/arrow-right.svg';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera } from 'react-native-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
// import { setBidImages } from '../../redux/reducers/bidSlice';



const AddImages = ({ addImg, setAddImg,bidImages,setBidImages }) => {

    const dispatch = useDispatch();
   
    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    const [camera, setCamera] = useState(null);
//   const bidImages = useSelector((state) => state.bid.bidImages);
    

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, [addImg]);

    const takePicture = async () => {

        const options = {
            mediaType: 'photo',
            saveToPhotos: true,
        };
        console.log('start camera', options);
        launchCamera(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
                setAddImg(false);
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                try {
                    const newImageUri = response.assets[0].uri;
                    const compressedImage = await manipulateAsync(
                        newImageUri,
                        [{ resize: { width: 600, height: 800 } }],
                        { compress: 0.5, format: "jpeg", base64: true }
                    );
            console.log('clickImage', compressedImage.uri);
            setBidImages((prevImages) => [ compressedImage.uri,...prevImages]);

    
                    // dispatch(setBidImages(compressedImage.uri));
                    // await getImageUrl(compressedImage);
                } catch (error) {
                    console.error('Error processing image: ', error);
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

        
        if (!result.canceled) {
            const newImageUri = result?.assets[0]?.uri;
            const compressedImage = await manipulateAsync(
                newImageUri,
                [{ resize: { width: 600, height: 800 } }],
                { compress: 0.5, format: "jpeg" }
            );
            console.log('pickImage', compressedImage.uri);
            setBidImages((prevImages) => [ compressedImage.uri,...prevImages]);

            

            
        }
    };

    // if (hasCameraPermission === null) {
    //     return <View />;
    // }
    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View className="absolute  left-0 right-0 bottom-0 z-50 h-screen" style={styles.overlay}>
            <TouchableOpacity onPress={() => { setAddImg(false) }}>
                <View className="h-4/5 w-screen "  >
                </View>
            </TouchableOpacity>
            <View className=" h-1/5 bg-white " styles={{
                shadowColor: '#bdbdbd',
                shadowOffset: { width: 2, height: -2 },  // Shadow on top side
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 80,
            }}>

                <TouchableOpacity onPress={() => { pickImage(); setAddImg(false) }}>
                    <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[20px] pt-[30px]  border-b-[1px] border-gray-400">
                        <Text style={{ fontFamily: "Poppins-Regular" }}>Upload Image</Text>
                        <ArrowRight />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { takePicture(); setAddImg(false); }}>
                    <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[20px]">
                        <Text style={{ fontFamily: "Poppins-Regular" }}>Click Image</Text>
                        <ArrowRight />
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        zIndex: 100,
        //   flex: 1,
        //   ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        //  position:"absolute",
        //  bottom:0// Semi-transparent greyish background
    },
    // menuContainer: {
    //     flex: 1,
    //     // Add other styles for menu container
    // },

});

export default AddImages