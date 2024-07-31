import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  Platform,
  Dimensions,
  Animated,
  Modal,

} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import StoreName from "../../assets/PanScreenImg.svg";
import BackArrow from "../../assets/BackArrow.svg";
import AddMoreImage from "../../assets/AddMoreImg.svg";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  setPanCard,
  setUserDetails,
  setPanScreenImage,
  setAccessToken,
  setRefreshToken
} from "../../redux/reducers/storeDataSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { manipulateAsync } from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import { launchCamera } from "react-native-image-picker";
import DelImg from "../../assets/delImgOrange.svg"
import RightArrow from "../../assets/arrow-right.svg";
import { baseUrl } from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DocumentIcon from '../../assets/DocumentIcon.svg';
import ErrorModal from "../../components/ErrorModal";





const PanCardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [addMore, setAddMore] = useState(false);
  const mobileNumber = useSelector((state) => state.storeData.mobileNumber);
  const storeName = useSelector((state) => state.storeData.storeName);
  const storeOwnerName = useSelector((state) => state.storeData.storeOwnerName);
  const storeService = useSelector((state) => state.storeData.storeService);
  const storeCategory = useSelector((state) => state.storeData.storeCategory);
  const user = useSelector((state) => state.storeData.userDetails);
  const uniqueToken = useSelector((state) => state.storeData.uniqueToken);
  const accessToken = useSelector((state) => state.storeData.accessToken)


  const [cameraScreen, setCameraScreen] = useState(false);
  const [imagesLocal, setImagesLocal] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [panCard, setPanCardLocal] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { width } = Dimensions.get("window");
  // console.log("User data sent to", uniqueToken);
  const [errorModal, setErrorModal] = useState(false)
 const [fileSize,setFileSize] = useState(0)

  console.log(
    mobileNumber,
    storeCategory,
    storeName,
    storeOwnerName,
    storeService,
    panCard,
    uniqueToken
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));

  const handleImagePress = (image) => {
    setSelectedImage(image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };
  const handlePanCard = (panCard) => {
    dispatch(setPanCard(panCard));
    setPanCardLocal(panCard);
  };

  const handleNext = async () => {
    setLoading(true);

    try {
      // Create user data object

      // Send user data to the server\

      
      
      const response = await axios.post(
        `${baseUrl}/retailer/`,
        {
          storeOwnerName: storeOwnerName,
          storeName: storeName,
          storeMobileNo: mobileNumber,
          storeCategory: storeCategory,
          homeDelivery: storeService,
          panCard: panCard,
        }
      );
      console.log("res of creating new retailer", response.data);

      // Check if user creation was successful

      if (response.status === 201) {
        console.log("User created:", response.data);
        dispatch(setAccessToken(response.data.accessToken));
        dispatch(setRefreshToken(response.data.refreshToken));

       
        await AsyncStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
        await AsyncStorage.setItem("refreshToken", JSON.stringify(response.data.refreshToken));
        // dispatch(setUserDetails(response.data));
        const configg = {
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${response.data.accessToken}`,
          }
         }
        const res = await axiosInstance.patch(
          `${baseUrl}/retailer/editretailer`,
          {
            _id: response?.data?.retailer?._id,
            uniqueToken: uniqueToken,
          },configg
        );
        dispatch(setUserDetails(res.data));
        await AsyncStorage.setItem("userData", JSON.stringify(res.data));



        // Navigate to the next screen
        navigation.navigate("completeProfile");
        setLoading(false);
      } else {
        // Handle error if user creation failed
        console.error("Error creating user:");
        Alert.alert("Error", "Failed to create user. Please try again later.");
        setLoading(false);
      }
    } catch (error) {
      // Handle error if request fails
      console.error("Error creating user:", error);
      Alert.alert(

        "An unexpected error occurred. Please try again later."
      );
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasCameraPermission(status === "granted");
  //   })();
  // }, [cameraScreen]);
  // const takePicture = async () => {
  //   const options = {
  //     mediaType: 'photo',
  //     saveToPhotos: true,
  //   };

  //   launchCamera(options, async (response) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ');
  //     } else {
  //       try {
  //         const newImageUri = response.assets[0].uri;
  //         const compressedImage = await manipulateAsync(
  //           newImageUri,
  //           [{ resize: { width: 600, height: 800 } }],
  //           { compress: 0.5, format: "jpeg", base64: true }
  //         );
  //         await getImageUrl(compressedImage.uri);
  //       } catch (error) {
  //         console.error('Error processing image: ', error);
  //       }
  //     }
  //   });
  // };

  // const getImageUrl = async (image) => {
  //   setLoading(true)
  //   try {
  //     const formData = new FormData();

  //     formData.append('storeImages', {
  //       uri: image,
  //       type: 'image/jpeg',
  //       name: `photo-${Date.now()}.jpg`
  //     })
  //     const config = {
  //       headers:{
  //         'Content-Type':'multipart/form-data',
  //         'Authorization':`Bearer ${accessToken}`,
  //       }
  //      }
  //     console.log('config', config)
  //     await axios.post(`${baseUrl}/upload`, formData, config)
  //       .then(res => {
  //         console.log('imageUrl updated from server', res.data[0]);
  //         const imgUri = res.data[0];
  //         if (imgUri) {
  //           console.log("Image Updated Successfully");
  //           setImagesLocal(imgUri);
  //           dispatch(setPanScreenImage(imgUri));
  //           dispatch(setPanCard(imgUri));
  //           setPanCardLocal(imgUri);
  //           setLoading(false);
  //         }
  //       })
  //   } catch (error) {
  //     setLoading(false);
  //     console.error('Error getting imageUrl: ', error);
  //   }
  // }


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

    if (!result?.canceled) {
        // const fileInfo = await RNFS.stat(result.uri.replace('file://', ''));
        
        const fileSizeMB = parseFloat(result?.assets[0].size) / (1e6); // Convert bytes to MB
        console.log(fileSizeMB);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            setErrorModal(true);
            console.error(
                'File Size Limit Exceeded',
                `Please select a file smaller than ${MAX_FILE_SIZE_MB}MB`
            );
        }
        else {
          console.log(result);
          const formData = new FormData();

          formData.append('storeImages',{
            uri:result.assets[0].uri,
            type:result.assets[0].mimeType,
            name:result.assets[0].name,
          })
          
          const config = {
            headers:{
              'Content-Type':'multipart/form-data',
              'Authorization':`Bearer ${accessToken}`,
            }
           }
          await axios.post(`${baseUrl}/upload`, formData,config)
            .then(async(res) => {
              console.log('imageUrl updated from server', res.data[0]);
              const imgUri = res.data[0];
              if (imgUri) {
            setImagesLocal(result);
            setFileSize(fileSizeMB);
            setPanCardLocal(imgUri);
              }
        })
      }

    return null;

}

    }


  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [3, 4],
  //     base64: true,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     const newImageUri = result.assets[0].uri;
  //     const compressedImage = await manipulateAsync(
  //       newImageUri,
  //       [{ resize: { width: 600, height: 800 } }],
  //       { compress: 0.5, format: "jpeg", base64: true }
  //     );
  //     await getImageUrl(compressedImage.uri);
  //   }
  // };

  // if (hasCameraPermission === null) {
  //   return <View />;
  // }
  // if (hasCameraPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }

  const deleteImage = () => {

    setImagesLocal("");
    // dispatch(setPanCard(""));
    setPanCardLocal("");
  };



  return (
    <>
    <View style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="height"

        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
          >
            <View
              style={{
                justifyContent: "center"
                ,paddingBottom:100
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  top: 20,
                  zIndex: 40,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 32,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ padding: 6 }}
                >
                  <BackArrow width={16} height={12} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext}>
                  <Text
                    style={{ fontSize: 16, padding: 2, fontFamily: 'Poppins-Bold' }}
                    className="text-white "
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex flex-col justify-center items-center px-[32px] gap-[20px]">
                <StoreName className="object-cover" />
                <Text className="text-[14.5px]  text-[#FB8C00]" style={{ fontFamily: "Poppins-Bold" }}>
                  Step 6/6
                </Text>
              </View>
              <View style={{
                marginTop: 20,
                paddingHorizontal: 32
              }}
              >
                <Text
                  style={{ fontSize: 16, color: "#2e2c43", fontFamily: "Poppins-SemiBold" }}
                >
                  Please submit your documents
                </Text>
                <Text style={{ fontSize: 14, color: "#2e2c43", fontFamily: "Poppins-Regular" }}>
                  GST Certificate/Labor Certificate
                </Text>
                <View className="flex flex-row  mt-[10px]">
                  <TouchableOpacity onPress={() => pickDocument()}>
                    <View>
                      <AddMoreImage />
                    </View>
                  </TouchableOpacity>
                  
                  {
                    // imagesLocal.length > 0 && (
                    //   <View className="rounded-[16px] pb-[100px]">

                    //     <Pressable

                    //       onPress={() => handleImagePress(imagesLocal)}
                    //     >
                    //       <View style={styles.imageWrapper}>
                    //         <Image
                    //           source={{ uri: imagesLocal }}
                    //           style={styles.image}
                    //         />
                    //         <Pressable
                    //           onPress={() => deleteImage()}
                    //           style={styles.deleteIcon}
                    //         >
                    //           <DelImg width={24} height={24} />
                    //         </Pressable>
                    //       </View>
                    //     </Pressable>
                    //   </View>
                    // )
                    panCard  && (
                      <View  className="rounded-[16px] w-[80%] mb-[50px]">
                        <View className="flex-col items-center">
                      <DocumentIcon size={30} />
                      <Text className=" text-[16px] pt-[10px] w-[70%] text-center">{imagesLocal ?imagesLocal?.assets[0].name:""}</Text>
                      <Text className="pt-[5px]">{fileSize < 1 ? `${(parseFloat(fileSize).toFixed(3) * 1000)} kb` : `${parseFloat(fileSize).toFixed(1)}Mb`}</Text>
                  </View>
                    {/* <Image
                      source={{ uri: imagesLocal }}
                      width={154}
                      height={124}
                      className="rounded-[16px] border-[1px] border-[#cbcbce] object-cover"
                    /> */}
                    <Pressable
                                onPress={() => deleteImage()}
                                style={styles.deleteIcon}
                              >
                               <DelImg width={30} height={30} />
                              </Pressable>
                  </View>
                    )
                  }

                
                </View>


              </View>

            </View>
          </ScrollView>
          {!addMore && (
            <TouchableOpacity
              onPress={handleNext}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 68,
                backgroundColor: "#fb8c00",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={{ color: "white", fontSize: 18, fontFamily: "Poppins-Black" }}>
                  Next
                </Text>
              )}
            </TouchableOpacity>
          )}
          {/* {addMore && (
            <View style={{ flex: 1 }} className="absolute  left-0 right-0 bottom-0 z-50 h-screen shadow-2xl " >
              <TouchableOpacity onPress={() => { setAddMore(false) }}>
                <View className="h-full w-screen " style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}  >
                </View>
              </TouchableOpacity>
              <View className="bg-white absolute bottom-0 left-0 right-0 ">

                <TouchableOpacity onPress={() => { pickImage(); setAddMore(false) }}>
                  <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[30px]  border-b-[1px] border-gray-400">
                    <Text style={{ fontFamily: "Poppins-Regular" }}>Upload Image</Text>
                    <RightArrow />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { takePicture(); setAddMore(false); }}>
                  <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[30px]">
                    <Text style={{ fontFamily: "Poppins-Regular" }}>Click Image</Text>
                    <RightArrow />
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          )} */}

       {errorModal && <ErrorModal errorModal={errorModal} setErrorModal={setErrorModal}/>}

        </KeyboardAvoidingView>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fb8c00" />
          </View>
        )}
      </View>
      
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",

  },
  deleteIcon: {
    position: "absolute",
    top: -10,
    right:40,
    // backgroundColor: "white",
    borderRadius: 50,
    borderColor:"#fc8b00",
    borderWidth:1,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: 30,
    gap: 5,
    marginTop: 10,
  },
  imageWrapper: {
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "gray",
  },
  image: {
    width: 168,
    height: 232,
    borderRadius: 10,
  },
  // deleteIc: {
  //   position: 'absolute',
  //   top: 5,
  //   right: 5,
  // },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent greyish background
  },
});
export default PanCardScreen;
