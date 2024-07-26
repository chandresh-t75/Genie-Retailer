import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ClickImage from "../../assets/ClickImg.svg";
import AddMoreImage from "../../assets/AddMoreImg.svg";

import DelImg from "../../assets/delImgOrange.svg";
import {
  FontAwesome,
  Entypo,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../../redux/reducers/storeDataSlice";
import ModalCancel from "../../components/ModalCancel";
import { manipulateAsync } from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import { launchCamera } from "react-native-image-picker";
import axios from "axios";
import BackArrow from "../../assets/BackArrow.svg";
import RightArrow from "../../assets/arrow-right.svg";
import { baseUrl } from "../utils/constants";

const AddImageScreen = () => {
  const [imagesLocal, setImagesLocal] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [cameraScreen, setCameraScreen] = useState(false);
  const [addMore, setAddMore] = useState(false);
  const [imgIndex, setImgIndex] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [whiteBalance, setWhiteBalance] = useState(
    Camera.Constants.WhiteBalance.auto
  );
  const [autoFocus, setAutoFocus] = useState(Camera.Constants.AutoFocus.on);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const accessToken = useSelector((state) => state.storeData.accessToken);

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

  // const takePicture = async () => {
  //   if (camera) {
  //     const photo = await camera.takePictureAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,

  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       base64: true,
  //       quality: 0.5,
  //     });

  //     const compressedImage = await manipulateAsync(
  //       photo.uri,
  //       [{ resize: { width: 800, height: 800 } }],
  //       { compress: 0.5, format: "jpeg", base64: true }
  //     );

  //     await getImageUrl(compressedImage);
  //   }
  // };
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
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await axios.post(`${baseUrl}/upload`, formData, config).then((res) => {
        console.log("imageUrl updated from server", res.data[0]);
        const imgUri = res.data[0];
        if (imgUri) {
          console.log("Image Updated Successfully");
          setImagesLocal((prevImages) => [...prevImages, imgUri]);
          dispatch(setImages(imgUri));
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
      console.error("Error getting imageUrl: ", error);
    }
  };
  // const getImageUrl = async (image) => {
  //   setLoading(true);
  //   const CLOUDINARY_URL =
  //     "https://api.cloudinary.com/v1_1/kumarvivek/image/upload";
  //   const base64Img = `data:image/jpg;base64,${image.base64}`;
  //   const data = {
  //     file: base64Img,
  //     upload_preset: "CulturTap",
  //     quality: 50,
  //   };

  //   try {
  //     const response = await fetch(CLOUDINARY_URL, {
  //       body: JSON.stringify(data),
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       method: "POST",
  //     });

  //     const result = await response.json();
  //     if (result.secure_url) {
  //       setImagesLocal((prevImages) => [...prevImages, result.secure_url]);
  //       dispatch(setImages(result.secure_url));

  //       setCameraScreen(false);
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     setLoading(false);
  //     console.log(err);
  //   }
  // };

  const deleteImage = (index) => {
    setImgIndex(index);
    setModalVisible(true);
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

  return (
    <>
      {!cameraScreen && (
        <View style={{ flex: 1 }} className="bg-white">
          <View style={{ flex: 1, marginTop: 30 }}>
            <View className="w-full z-40  flex flex-row justify-between items-center px-[32px]">
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
                className="text-[16px] flex flex-1 justify-center  items-center text-center text-[#2E2C43]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Add Store Image
              </Text>
              {/* {imagesLocal.length === 0 && <Pressable onPress={() => navigation.navigate("addexpectedprice")} className="">
                <Text className="text-[16px] text-[#FB8C00]">Skip</Text>
              </Pressable>} */}
            </View>
            <View className="mt-[10px] mb-[27px]">
              {imagesLocal.length === 0 ? (
                <Text
                  className="text-[14.5px]  text-[#FB8C00] text-center mb-[10px]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Step 2/4
                </Text>
              ) : (
                <Text
                  className="text-[14.5px]  text-[#FB8C00] text-center mb-[10px]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Step 3/4
                </Text>
              )}
              <Text
                className="text-[14px] text-center px-[32px] text-[#2e2c43]"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                Please remember to provide easy-to-understand image references
                that people can use to find your shop.
              </Text>
            </View>

            {imagesLocal.length === 0 ? (
              <View className="z-0 mt-[20px]">
                <TouchableOpacity onPress={() => takePicture()}>
                  <View className="flex-row justify-center">
                    <ClickImage />
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => pickImage()}>
                  <View className="mx-[28px] mt-[30px] h-[63px] flex-row items-center justify-center border-2 border-[#fb8c00] rounded-3xl">
                    <Text
                      className="text-[16px]  text-[#fb8c00] text-center"
                      style={{ fontFamily: "Poppins-ExtraBold" }}
                    >
                      Browse Image
                    </Text>
                  </View>
                </TouchableOpacity> */}
              </View>
            ) : (
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.container}>
                    <View style={styles.imageContainer}>
                      {imagesLocal.map((image, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleImagePress(image)}
                        >
                          <View style={styles.imageWrapper}>
                            <Image
                              source={{ uri: image }}
                              style={styles.image}
                            />
                            <Pressable
                              onPress={() => deleteImage(index)}
                              style={styles.deleteIcon}
                            >
                              <DelImg width={24} height={24} />
                            </Pressable>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                    <Modal
                      transparent
                      visible={!!selectedImage}
                      onRequestClose={handleClose}
                    >
                      <Pressable
                        style={styles.modalContainer}
                        onPress={handleClose}
                      >
                        <Animated.Image
                          source={{ uri: selectedImage }}
                          style={[
                            styles.modalImage,
                            {
                              transform: [{ scale: scaleAnimation }],
                            },
                          ]}
                        />
                      </Pressable>
                    </Modal>
                  </View>
                </ScrollView>
                <TouchableOpacity
                  onPress={() => setAddMore(!addMore)}
                  style={{ alignSelf: "flex-start" }}
                >
                  <View style={{ marginLeft: 36, marginTop: 45 }}>
                    <AddMoreImage />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {!addMore ? (
              imagesLocal.length > 0 && (
                <View className="w-full h-[68px] bg-[#fb8c00] justify-center absolute bottom-0 left-0 right-0">
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("imagePreview", { data: imagesLocal })
                    }
                  >
                    <View className="w-full flex justify-center items-center">
                      <Text
                        className="text-white  text-center text-[16px]"
                        style={{ fontFamily: "Poppins-Black" }}
                      >
                        Continue
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <View
                style={{ flex: 1 }}
                className="absolute  left-0 right-0 bottom-0 z-50 h-screen shadow-2xl "
              >
                <TouchableOpacity
                  onPress={() => {
                    setAddMore(false);
                  }}
                >
                  <View
                    className="h-full w-screen "
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  ></View>
                </TouchableOpacity>
                <View className="bg-white absolute bottom-0 left-0 right-0 ">
                  {/* <TouchableOpacity onPress={() => { pickImage(); setAddMore(false) }}>
                  <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[30px]  border-b-[1px] border-gray-400">
                    <Text style={{ fontFamily: "Poppins-Regular" }}>Upload Image</Text>
                    <RightArrow />
                  </View>
                </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => {
                      takePicture();
                      setAddMore(false);
                    }}
                  >
                    <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] pt-[30px] pb-[10px]">
                      <Text style={{ fontFamily: "Poppins-Bold" }}>
                        Click Image
                      </Text>
                      <RightArrow />
                    </View>
                    <Text
                      className="w-[90%] items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] pb-[30px]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      Please take a real photo of your store for customers'
                      shopping reference.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <ModalCancel
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            imagesLocal={imagesLocal}
            setImagesLocal={setImagesLocal}
            index={imgIndex}
          />
          {modalVisible && <View style={styles.overlay} />}
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 174,
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
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 2,
  },
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent greyish background
  },
  bottomBar: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  captureButton: {
    alignSelf: "center",
    backgroundColor: "#FB8C00",
    padding: 10,
    borderRadius: 100,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default AddImageScreen;
