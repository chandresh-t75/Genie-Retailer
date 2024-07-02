import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import ThreeDots from "../../assets/ThreeDotIcon.svg";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Copy from "../../assets/Copy.svg";


import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Profile from "../../assets/ProfileIcon2.svg";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import ClickImage from "../../assets/ClickImg.svg";
import AddMoreImage from "../../assets/AddMoreImg.svg";
import { useDispatch, useSelector } from "react-redux";
import { setBidImages } from "../../redux/reducers/bidSlice";
import ModalCancel from "../../components/ModalCancel";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { manipulateAsync } from "expo-image-manipulator";
import { launchCamera } from "react-native-image-picker";
import Close from "../../assets/RedClose.svg";
import BackArrow from "../../assets/arrow-left.svg";
import * as Clipboard from 'expo-clipboard';


const BidPageImageUpload = () => {
  const [images, setImages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { user, messages, setMessages } = route.params;
  const [imgIndex, setImgIndex] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraScreen, setCameraScreen] = useState(false);
  const [addMore, setAddMore] = useState(false);
  const [copied, setCopied] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [whiteBalance, setWhiteBalance] = useState(
    Camera.Constants.WhiteBalance.auto
  );
  const [autoFocus, setAutoFocus] = useState(Camera.Constants.AutoFocus.on);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const requestInfo = useSelector((state) => state.requestData.requestInfo);

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
  //       setImages((prevImages) => [...prevImages, result.secure_url]);

  //       setCameraScreen(false);
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     setLoading(false);
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, [cameraScreen]);

  const handleNext = () => {
    dispatch(setBidImages(images));
    navigation.navigate("bidOfferedPrice", {
      user,
      messages,
      setMessages,
    });
  };

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
          setImages((prevImages) => [...prevImages, compressedImage.uri]);
          // await getImageUrl(compressedImage);
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
      const newImageUri = result.assets[0].uri;
      const compressedImage = await manipulateAsync(
        newImageUri,
        [{ resize: { width: 600, height: 800 } }],
        { compress: 0.5, format: "jpeg", base64: true }
      );
      setImages((prevImages) => [...prevImages, compressedImage.uri]);
      //   const processedUri = await handleImageProcessing(result.assets[0]);
      //   console.log("photodrive", processedUri);
      // await getImageUrl(result.assets[0]);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const deleteImage = (index) => {
    setImgIndex(index);
    setModalVisible(true);
  };


  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(requestInfo?.requestId?._id);
      console.log('Text copied to clipboard');
      setCopied(true);

      // Hide the notification after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
    }
  };

  return (
    <>
      {!cameraScreen && (
        <View style={{ flex: 1, backgroundColor: "#ffe7c8" }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="relative flex-grow bg-[#ffe7c8]">
              <View className=" bg-[#ffe7c8] w-full flex flex-row px-[32px] justify-evenly gap-[5px] items-center pt-[40px] pb-[20px]">
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{ padding: 6 }}
                >
                  <BackArrow width={14} height={10} />
                </TouchableOpacity>

                <View className="gap-[9px] ml-4">
                  <View className="flex-row gap-[18px] items-center">
                    <View className=" rounded-full bg-white p-[4px] ">
                      {requestInfo?.customerId?.pic ? (
                        <Image
                          source={{ uri: requestInfo?.customerId?.pic }}
                          style={{ width: 40, height: 40, borderRadius: 20 }}
                        // className="w-[40px] h-[40px] rounded-full"
                        />
                      ) : (
                        <Profile className="" />
                      )}
                    </View>
                    <View className="w-[70%]">
                      <Text
                        className="text-[14px] text-[#2e2c43] capitalize"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        {requestInfo?.customerId?.userName}
                      </Text>

                      <Text
                        className="text-[12px] text-[#79B649]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        Online
                      </Text>
                    </View>
                  </View>
                </View>
                {images.length === 0 && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("bidOfferedPrice", {
                        user,
                        messages,
                        setMessages,
                      })
                    }
                    className=""
                  >
                    <Text
                      className="text-[14px] text-[#FB8C00] "
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Skip
                    </Text>
                  </TouchableOpacity>
                )}

                {/* <Pressable onPress={() => { console.log("hii") }}>
                                <ThreeDots />
                            </Pressable> */}
              </View>
              <View className="px-[40px] pb-[20px] flex bg-[#FFE7C8]">
                <View className="flex-row gap-[10px] items-center">
                  <Text
                    className="text-[16px] "
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    Request Id
                  </Text>
                  <Text style={{ fontFamily: "Poppins-Regular" }}>
                    {requestInfo?.requestId?._id}
                  </Text>
                  <TouchableOpacity onPress={() => { copyToClipboard() }} style={{ padding: 4 }}>
                    <Copy />
                  </TouchableOpacity>
                  {copied && <Text className="bg-[#ebebeb] p-2 rounded-lg z-50 absolute -top-10 right-0">Copied!</Text>}
                </View>
                <Text style={{ fontFamily: "Poppins-Regular" }}>
                  {requestInfo?.requestId?.requestDescription
                    ?.split(" ")
                    .slice(0, 12)
                    .join(" ")}
                  ....
                </Text>
                {/* {
              route.params?.data ? ( <Text>{req?.requestId?.requestDescription}</Text>):( <Text>{requestInfo?.requestId?.requestDescription}</Text>)
            } */}
              </View>

              <View className="flex gap-[16px] px-[50px] pt-[10px] pb-[10px]">
                <View className="flex-row justify-between">
                  <Text className="" style={{ fontFamily: "Poppins-Bold" }}>
                    Send an offer
                  </Text>
                  <Text
                    className="text-[#FB8C00] text-[14px] "
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    Step 2/3
                  </Text>
                </View>
                <Text style={{ fontFamily: "Poppins-Regular" }}>
                  Provide product images for better reference to customers to
                  showcase product quality and confirm availability.
                </Text>
              </View>
            </View>
            <View className="pb-[100px]">
              {images.length === 0 && (
                <View className="z-0">
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        takePicture();
                      }}
                    >
                      <View className="flex-row justify-center">
                        <ClickImage />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        pickImage();
                        console.log("pressed pickimg");
                      }}
                    >
                      <View className="mx-[28px] mt-[30px] h-[63px] flex-row items-center justify-center border-2 border-[#fb8c00] rounded-3xl">
                        <Text
                          className="text-[16px]  text-[#fb8c00] text-center"
                          style={{ fontFamily: "Poppins-ExtraBold" }}
                        >
                          Browse Image
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {images.length > 0 && (
                <View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <View style={styles.container}>
                      <View style={styles.imageContainer}>
                        {images.map((image, index) => (
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
                                <Close />
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
                        <Pressable style={styles.modalContainer} onPress={handleClose}>
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
                    <View
                      style={{
                        marginLeft: 36,
                        marginTop: 30,
                        position: "relative",
                      }}
                    >
                      <AddMoreImage />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {!addMore ? (
                images.length > 0 && (
                  <TouchableOpacity
                    onPress={handleNext}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 63,
                      width: "100%",
                      backgroundColor: "#FB8C00",
                      justifyContent: "center", // Center content vertically
                      alignItems: "center", // Center content horizontally
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Poppins-Black",
                        color: "white",
                      }}
                    >
                      NEXT
                    </Text>
                  </TouchableOpacity>
                )
              ) : (
                <View className="w-full absolute bottom-0 bg-white items-center left-0 right-0 px-[10px]">
                  <TouchableOpacity
                    onPress={() => {
                      pickImage();
                      setAddMore(false);
                    }}
                  >
                    <View className="w-full flex flex-row justify-between px-[40px] py-[15px]">
                      <Text
                        className="text-[14px]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        Upload Image
                      </Text>
                      <FontAwesome6
                        name="arrow-right"
                        size={15}
                        color="black"
                      />
                    </View>
                  </TouchableOpacity>
                  <View className="h-[1px] w-full bg-gray-300 "></View>
                  <TouchableOpacity
                    onPress={() => {
                      takePicture();
                      setAddMore(false);
                    }}
                  >
                    <View className="w-full flex flex-row justify-between px-[40px] py-[15px]">
                      <Text
                        className="text-[14px]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        Click Image
                      </Text>
                      <FontAwesome6
                        name="arrow-right"
                        size={15}
                        color="black"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

          <ModalCancel
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            imagesLocal={images}
            setImagesLocal={setImages}
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
    width: 150,
    height: 200,
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

export default BidPageImageUpload;
