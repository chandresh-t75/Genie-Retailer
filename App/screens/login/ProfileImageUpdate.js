import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
// import { setMainImage,addOtherImage } from '../../redux/reducers/storeDataSlice';
import { useDispatch, useSelector } from "react-redux";
import { setImages, setUserDetails } from "../../redux/reducers/storeDataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackArrow from "../../assets/BackArrow.svg";
import AddMoreImage from "../../assets/AddMoreImg.svg";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { manipulateAsync } from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import { launchCamera } from "react-native-image-picker";
import DelImg from "../../assets/delImgOrange.svg";
import RightArrow from "../../assets/arrow-right.svg";
import { baseUrl } from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";


const ProfileImageUpdate = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [imagesLocal, setImagesLocal] = useState(route.params.data);
  const dispatch = useDispatch();
  console.log("images", imagesLocal);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cameraScreen, setCameraScreen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [panCard, setPanCardLocal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const [addMore, setAddMore] = useState(false);
  const accessToken = useSelector((state) => state.storeData.accessToken)



  const handleImage = async () => {
    setLoading(true);
    console.log("old images", imagesLocal);
    const newImages = [...imagesLocal];
    [newImages[0], newImages[selectedImageIndex]] = [
      newImages[selectedImageIndex],
      newImages[0],
    ];
    //  setImagesLocal(newImages);
    //  console.log("new images",imagesLocal);
    //  setSelectedImageIndex(0);
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    const userId = userData._id;



    try {
      // Update location on server
      const config = {
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${accessToken}`,
        }
       }
      const response = await axiosInstance.patch(
        `${baseUrl}/retailer/editretailer`,
        {
          _id: userId,
          storeImages: newImages,
        },config
      );

      // console.log('Image updated successfully:', response.data);

      // Update user data in AsyncStorage
      dispatch(setUserDetails(response.data));
      await AsyncStorage.setItem("userData", JSON.stringify(response.data));

      // Navigate to home only after successfully updating the location
      setLoading(false);
      navigation.navigate("profile");
    } catch (error) {
      setLoading(false);
      console.error("Failed to update images:", error);
      // Optionally handle error differently here
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, [cameraScreen]);
  const takePicture = async () => {
    const options = {
      mediaType: "photo",
      saveToPhotos: true,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ");
      } else {
        try {
          const newImageUri = response.assets[0].uri;
          const compressedImage = await manipulateAsync(
            newImageUri,
            [{ resize: { width: 600, height: 800 } }],
            { compress: 0.5, format: "jpeg", base64: true }
          );
          await getImageUrl(compressedImage.uri);
        } catch (error) {
          console.error("Error processing image: ", error);
        }
      }
    });
  };

  const getImageUrl = async (image) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("storeImages", {
        uri: image,
        type: "image/jpeg",
        name: `photo-${Date.now()}.jpg`,
      });
      const config = {
        headers:{
          'Content-Type':'multipart/form-data',
          'Authorization':`Bearer ${accessToken}`,
        }
       }
      await axios
        .post(`${baseUrl}/upload`, formData,config)
        .then((res) => {
          console.log("imageUrl updated from server", res.data[0]);
          const imgUri = res.data[0];
          if (imgUri) {
            console.log("Image Updated Successfully");
            setImagesLocal([imgUri, ...imagesLocal]);
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      console.error("Error getting imageUrl: ", error);
    }
  };



  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImageUri = result.assets[0].uri;
      const compressedImage = await manipulateAsync(
        newImageUri,
        [{ resize: { width: 600, height: 800 } }],
        { compress: 0.5, format: "jpeg", base64: true }
      );
      await getImageUrl(compressedImage.uri);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //   const deleteImage = () => {
  //     setImagesLocal("");
  //   };

  return (
    <View style={{ flex: 1 }} className="bg-white">
      <ScrollView >
        <View className="w-full z-40 mt-[30px]  flex flex-row justify-between items-center px-[32px]">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              padding: 24,
              paddingTop: 16,
              position: "absolute",
              zIndex: 100,
            }}
          >
            <BackArrow />
          </TouchableOpacity>
          <Text
            className="flex flex-1 justify-center items-center text-center text-[16px]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Edit Profile Picture
          </Text>
        </View>

        <View className="w-full flex items-center justify-center mt-[20px]">
          <View
            style={{ overflowX: "scroll" }}
            className="flex-row w-screen justify-center  gap-[10px]"
          >
            {
              <View className="rounded-full">
                {imagesLocal ? (
                  <Image
                    source={{ uri: imagesLocal[selectedImageIndex] }}
                    width={200}
                    height={200}
                    className="rounded-full border-[1px] border-slate-400 object-contain"
                  />
                ) : (
                  <View className="h-[200px] w-[200px] rounded-full border-[1px] border-slate-400 object-contain"></View>
                )}
              </View>
            }
          </View>
        </View>
        <Text className="flex justify-center items-center text-center text-[16px] mt-[30px]"
          style={{ fontFamily: "Poppins-Bold" }}>Select Profile Picture</Text>
        {
          imagesLocal && imagesLocal?.length > 0 &&
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ maxHeight: 240 }}>
            <View className="flex-row  gap-[10px] mt-[25px] px-[32px]">
              {imagesLocal.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImageClick(index)}
                >
                  <View
                    className={`rounded-3xl ${selectedImageIndex === index
                      ? "border-4 border-[#fb8c00]"
                      : "border-[1px] border-slate-400"
                      }`}
                  >
                    <Image
                      source={{ uri: image }}
                      width={140}
                      height={200}
                      className="rounded-3xl object-contain"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        }


        <View className="flex flex-row gap-[40px] mt-[10px] px-[32px] pb-[100px] justify-center">

          <TouchableOpacity onPress={() => setAddMore(!addMore)}>
            <View>
              <AddMoreImage />
            </View>
          </TouchableOpacity>
        </View>




      </ScrollView>
      {addMore && (
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
      )}
      <TouchableOpacity
        disabled={imagesLocal?.length === 0}
        onPress={handleImage}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 63,
          width: "100%",
          backgroundColor:
            imagesLocal?.length===0 ? "#e6e6e6" : "#FB8C00",
          justifyContent: "center", // Center content vertically
          alignItems: "center", // Center content horizontally
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins-Black",
            color:  imagesLocal?.length===0 ? "#888888" : "white",
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 25,
    paddingHorizontal: 32,
  },
  contentContainer: {
    flexDirection: "row",
    gap: 10,
  },
  imageContainer: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "slategray",
    overflow: "hidden",
  },
  activeImageContainer: {
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: 140,
    height: 200,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",

  },
});

export default ProfileImageUpdate;
