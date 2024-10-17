import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EditIconWhite from "../../assets/editIconWhite.svg";
import EditIcon from "../../assets/editIcon.svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setProductImages, setUserDetails } from "../../redux/reducers/storeDataSlice";
import { launchCamera } from "react-native-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import DelImg from "../../assets/delImgOrange.svg";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import BackArrow from "../../assets/BackArrow.svg";
import { baseUrl } from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DocumentIcon from "../../assets/DocumentIcon.svg";
import DeleteImageModal from "../../components/DeleteImageModal";
import DeleteProductImage from "../../components/DeleteProductImage";
import AddMoreImage from "../../assets/AddMoreImg.svg";
import { Camera } from "expo-camera";
import AddProductImages from "../login/AddProductImages";

const initialReviews = [
  { customerName: "John Doe", stars: 3.3, review: "Great product!" },
  { customerName: "Jane Smith", stars: 5, review: "Excellent service!" },
  { customerName: "Alice Johnson", stars: 3, review: "Could be better." },
  { customerName: "Bob Brown", stars: 2, review: "Not satisfied." },
  { customerName: "Mary Davis", stars: 5, review: "Amazing quality!" },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //   const [user,setUser]= useState(route.params.user);
  const user = useSelector((state) => state.storeData.userDetails);
  // console.log("user at profile", user);

  const [editableField, setEditableField] = useState(null);
  const [location, setLocation] = useState(user?.location || "");

  const [storeName, setStoreName] = useState(user?.storeName || "");
  const [storeOwnerName, setStoreOwnerName] = useState(
    user?.storeOwnerName || ""
  );
  const [storeCategory, setStoreCategory] = useState(user?.storeCategory || "");
  const [storeMobileNo, setStoreMobileNo] = useState(user?.storeMobileNo || "");
  const [panCard, setPanCard] = useState(user?.panCard || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageProd, setSelectedImageProd] = useState(null);

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedDesc, setSelectedDesc] = useState("");


  const [scaleAnimation] = useState(new Animated.Value(0));
  const [indexImg, setIndexImg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [indexDelImg, setIndexDelImg] = useState(null);
  const [modalDelVisible, setModalDelVisible] = useState(false);
  const accessToken = useSelector((state) => state.storeData.accessToken);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [cameraScreen, setCameraScreen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imagesLocal, setImagesLocal] = useState([]);
  const [addProduct, setAddProduct] = useState(false);
  const [imgUri, setImgUri] = useState("");
  const [productImages,setProductImagesLocal]=useState([]);
  const [productLoading,setProductLoading]=useState(false);



  const handleImagePress = (image) => {
    setSelectedImage(image);

    // console.log("Image",image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleImagePressProduct = (image, price,desc) => {
    setSelectedImageProd(image);
    setSelectedPrice(price);
    setSelectedDesc(desc);

    // console.log("Image",image);
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
    }).start(() => {
      setSelectedImage(null);
      setSelectedImageProd(null);
      setSelectedPrice(null);
      setSelectedDesc("");
    });
  };

  const handleEditPress = (field) => {
    setEditableField(field);
  };

  const handleSavePress = async (field) => {
    const fieldMapping = {
      storeName,
      storeOwnerName,
      storeCategory,
      storeMobileNo,
      panCard,
      location,
    };
    setIsLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axiosInstance.patch(
        `${baseUrl}/retailer/editretailer`,
        {
          _id: user?._id,
          [field]: fieldMapping[field],
        },
        config
      );

      if (response.status === 200) {
        // Update successful
        // console.log("updated", response.data);
        dispatch(setUserDetails(response.data));
        await AsyncStorage.setItem("userData", JSON.stringify(response.data));

        console.log("Profile updated successfully");
      } else {
        // Handle the case where the update wasn't successful
        console.error("Failed to update profile");
      }

      setEditableField(null);
    } catch (error) {
      console.error("Failed to update profile", error);
      // Handle error (e.g., show an alert to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (index) => {
    setIndexImg(index);
    setModalVisible(true);
  };
  const handleProductImageClick = (index) => {
    setIndexDelImg(index);
    setModalDelVisible(true);
  };


  const handleDownloadDocument = async () => {
    // const url = `https://www.google.com/search?q=${encodeURIComponent(bidDetails.bidImages[0])}`
    const url = `${user?.panCard}`;
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  const fetchRetailerFeedbacks = useCallback(async () => {
    setFeedbackLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          id: user._id,
        },
      };
      await axiosInstance
        .get(`${baseUrl}/rating/get-retailer-feedbacks`, config)
        .then((res) => {
          // console.log("Feedbacks fetched successfully", res.data);
          setFeedbacks(res.data);
          setFeedbackLoading(false);
        });
    } catch (error) {
      setFeedbackLoading(false);
      console.error("Error while fetching retailer feedbacks", error);
    }
  });

  const fetchProductImages= async()=>{

    try {
      setProductLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          vendorId: user._id,
        },
      };
      await axiosInstance
       .get(`${baseUrl}/product/product-by-vendorId`, config)
       .then((res) => {
          // console.log("Product images fetched successfully", res.data);
          setProductImagesLocal(res.data);
          dispatch(setProductImages(res.data));
      setProductLoading(false);

        });
      
    } catch (error) {
      setProductLoading(false);
       console.error("Error while fetching product images", error);
    }

  }

  useEffect(() => {
    fetchProductImages();
    fetchRetailerFeedbacks();
  }, []);

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
    setLoading(true);
    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
        setLoading(false);
      } else if (response.error) {
        setLoading(false);
        console.log("ImagePicker Error: ");
      } else {
        try {
          const newImageUri = response.assets[0].uri;

          // Get the original image dimensions from the response
          const originalWidth = response.assets[0].width;
          const originalHeight = response.assets[0].height;

          // Calculate the new dimensions while keeping the aspect ratio
          const targetWidth = 600;
          const aspectRatio = originalHeight / originalWidth;
          const targetHeight = targetWidth * aspectRatio;
          console.log(targetHeight, targetWidth);
          const compressedImage = await manipulateAsync(
            newImageUri,
            [{ resize: { width: targetWidth, height: targetHeight } }],
            { compress: 0.8, format: "jpeg", base64: true }
          );

          setImgUri(compressedImage.uri);
          if (compressedImage.uri) {
            navigation.navigate("add-product-images", { imgUri: compressedImage.uri ,productImages:productImages,setProductImagesLocal:setProductImagesLocal});
           setLoading(false);
            
            // getImageUrl(compressedImage.uri);
          }
        } catch (error) {
          setLoading(false);
          console.error("Error processing image: ", error);
        }
      }
    });
  };

  // const getImageUrl = async (image) => {
  //   setLoading(true);
  //   try {
  //     const formData = new FormData();

  //     formData.append("storeImages", {
  //       uri: image,
  //       type: "image/jpeg",
  //       name: `photo-${Date.now()}.jpg`,
  //     });
  //     const config = {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     };
  //     await axios
  //       .post(`${baseUrl}/upload`, formData, config)
  //       .then(async (res) => {
  //         console.log("imageUrl updated from server", res.data[0]);
  //         const img = res.data[0];
  //         if (img) {
  //           setLoading(false);
  //         }
  //       });
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Error getting product imageUrl: ", error);
  //   }
  // };

  // if (hasCameraPermission === null) {
  //   return <View/>;
  // }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      {!addProduct && (
        <View className="bg-white">
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              className="flex "
              style={{
                position: "absolute",
                left: 10,
                top: 0,
                zIndex: 40,
                padding: 20,
                paddingTop: 40,
              }}
            >
              <View className="p-2 rounded-full">
                <BackArrow />
              </View>
            </TouchableOpacity>
            <View className="mt-[40px] flex">
              <View className="flex  relative flex-row px-[32px] items-center">
                <Text
                  className="text-[16px] flex-1 text-center"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Store Profile
                </Text>
              </View>
              <Text
                className="text-center mb-[20px] capitalize px-[32px] text-[#2E2C43]"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                {user?.storeName}
              </Text>
              <View className="flex items-center relative justify-center mb-[40px]">
                <View>
                  {user?.storeImages.length > 0 && (
                    <View>
                      <Pressable
                        onPress={() => handleImagePress(user?.storeImages[0])}
                      >
                        <Image
                          source={{ uri: user?.storeImages[0] }}
                          className="w-[130px] h-[130px] rounded-full object-cover"
                        />
                      </Pressable>

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
                  )}
                  {user?.storeImages.length === 0 && (
                    <View className="w-[130px] h-[130px] rounded-full bg-gray-300 border-[1px] border-gray-500"></View>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("update-profile-image", {
                        data: user?.storeImages,
                      });
                    }}
                  >
                    <View className="absolute right-[2px] bottom-[7px] w-[36px] h-[36px] bg-[#fb8c00] flex justify-center items-center rounded-full">
                      <EditIconWhite className="px-[10px]" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row items-center justify-between px-[32px] my-[10px]">
                <Text
                  style={{ fontFamily: "Poppins-Regular" }}
                  className="text-[#2E2C43]"
                >
                  Store Images
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("update-profile-image", {
                      data: user?.storeImages,
                    });
                  }}
                >
                  {/* <EditIcon className="p-[10px]" /> */}
                  <Text
                    style={{ fontFamily: "Poppins-Bold" }}
                    className="text-[#fb8c00]"
                  >
                    + Add
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  alignSelf: "flex-start",
                }}
              >
                <View className="px-[32px] flex flex-row gap-[11px] mb-[30px] w-max">
                  {user?.storeImages?.map((image, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleImagePress(image)}
                    >
                      <View
                        key={index}
                        className="rounded-[16px] w-[129px] h-[172px]"
                      >
                        <Image
                          source={{ uri: image }}
                          width={129}
                          height={172}
                          className="rounded-[16px] border-[1px] border-[#cbcbce]"
                        />
                        <Pressable
                          onPress={() => handleImageClick(index)}
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
              </ScrollView>

              <View className="flex-row items-center justify-between px-[32px]  mb-[15px]">
                <Text
                  style={{ fontFamily: "Poppins-Regular" }}
                  className="text-[#2E2C43]"
                >
                  Add Your Stocks
                </Text>
              </View>
              <View className="pl-[32px] flex flex-row items-center gap-[11px] mb-[60px]">
                <TouchableOpacity
                disabled={productLoading}
                  onPress={() => {
                    takePicture();
                  }}
                >
                  <View>
                    <AddMoreImage />
                  </View>
                </TouchableOpacity>
                {productLoading ? (
                     <View className="px-[20px]  flex flex-row justify-center items-center">
                      <ActivityIndicator size="small" color="#fb8c00"/>
                     </View>
                ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{
                    alignSelf: "flex-start",
                  }}
                >
                   
                  <View className="px-[20px] flex flex-row items-center gap-[11px] w-max">
                    {productImages && productImages?.map((image, index) => (
                      <Pressable
                        key={index}
                        onPress={() =>
                          handleImagePressProduct(image?.productImage, image?.productPrice,image?.productDescription)
                        }
                      >
                        <View
                          key={index}
                          className="rounded-[16px] w-[129px] h-[172px] relative"
                        >
                          <Image
                            source={{ uri: image?.productImage }}
                            width={129}
                            height={172}
                            className="rounded-[16px] border-[1px] border-[#cbcbce] object-fill"
                          />
                          <Pressable
                            onPress={() => handleProductImageClick(image?._id)}
                            style={styles.deleteIcon}
                          >
                            <DelImg width={24} height={24} />
                          </Pressable>
                        </View>
                        <View className="absolute bottom-0 bg-black bg-opacity-50 border-x-[1px] border-b-[1px] border-[#cbcbce] w-full flex justify-center items-center pt-1 rounded-b-[16px]">
                          {
                            image?.description &&<View className="flex justify-center  items-center ">
                            <Text
                              style={{ fontFamily: "Poppins-Regular" }}
                              className="text-white  text-[12px]"
                            >
                              {image?.productDescription?.substring(0, 18)}...
                            </Text>
                          </View>
                          }
                          <View className="flex justify-center  items-center ">
                            <Text
                              style={{ fontFamily: "Poppins-Regular" }}
                              className="text-white  text-[8px]"
                            >
                              Expected Price:
                            </Text>
                            <Text
                              style={{ fontFamily: "Poppins-SemiBold" }}
                              className="text-green-500  text-[14px]"
                            >
                              {image?.productPrice > 0 ? `Rs. ${image?.productPrice}` : "-"}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                  
                  <Modal
                    transparent
                    visible={!!selectedImageProd}
                    onRequestClose={handleClose}
                  >
                    <Pressable
                      style={styles.modalContainer}
                      onPress={handleClose}
                    >
                      <Animated.View
                        style={[
                          styles.modalImg,
                          {
                            transform: [{ scale: scaleAnimation }],
                          },
                        ]}
                      >
                        <Image
                          source={{ uri: selectedImageProd }}
                          style={styles.modalImage}
                        />
                        <View className="absolute bottom-0 bg-black bg-opacity-50 w-full flex justify-center items-center rounded-b-[16px]">
                        {
                            selectedDesc &&<View className="flex justify-center  items-center pt-2">
                            <Text
                              style={{ fontFamily: "Poppins-Regular" }}
                              className="text-white  text-[14px]"
                            >
                              {selectedDesc?.substring(0, 30)}...
                            </Text>
                          </View>
                          }
                          <View className="flex justify-center items-center p-1">
                            <Text
                              style={{ fontFamily: "Poppins-Regular" }}
                              className="text-white  text-[12px]"
                            >
                              Expected Price:
                            </Text>
                            <Text
                              style={{ fontFamily: "Poppins-SemiBold" }}
                              className="text-green-500  text-[18px]"
                            >
                              {selectedPrice > 0 ? `Rs. ${selectedPrice}` : "-"}
                            </Text>
                          </View>
                        </View>
                      </Animated.View>
                    </Pressable>
                  </Modal>
                </ScrollView>
                )}
              </View>
              <View className="px-[32px] flex flex-col gap-[26px] mb-[20px] items-center">
                <View className="px-[32px] mb-[10px]">
                  <Text
                    style={{ fontFamily: "Poppins-Regular" }}
                    className="mb-[10px] text-[#2E2C43] "
                  >
                    Store Address
                  </Text>
                  <View className="flex flex-row items-center justify-between w-[300px] py-[10px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                    <TextInput
                      value={user?.location}
                      placeholder={user?.location}
                      placeholderTextColor={"#dbcdbb"}
                      className="w-[200px] text-[14px]  text-[#2E2C43]  capitalize"
                      style={{ fontFamily: "Poppins-Regular" }}
                      multiline={true}
                      scrollEnabled={true}
                      editable={false}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("update-location");
                      }}
                      style={{ paddingHorizontal: 20 }}
                    >
                      <EditIcon className="px-[10px]" />
                    </TouchableOpacity>
                  </View>
                </View>
                <EditableField
                  label="Store Name"
                  value={storeName}
                  editable={editableField === "storeName"}
                  onChangeText={setStoreName}
                  onEditPress={() => handleEditPress("storeName")}
                  onSavePress={() => handleSavePress("storeName")}
                  isLoading={isLoading}
                  multiline={true}
                  scrollEnabled={true}
                />
                <EditableField
                  label="Store Owner Name"
                  value={storeOwnerName}
                  editable={editableField === "storeOwnerName"}
                  onChangeText={setStoreOwnerName}
                  onEditPress={() => handleEditPress("storeOwnerName")}
                  onSavePress={() => handleSavePress("storeOwnerName")}
                  isLoading={isLoading}
                />
                <View className="px-[20px] mb-[10px]">
                  <Text
                    style={{ fontFamily: "Poppins-Regular" }}
                    className="mb-[10px] text-[#2E2C43]"
                  >
                    Store Category
                  </Text>
                  <View className="flex flex-row items-center justify-between w-[300px] py-[10px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                    <Text
                      className="w-[240px] text-[14px]  text-[#2E2C43]  capitalize"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {storeCategory}
                    </Text>
                  </View>
                </View>
                <View className="px-[20px] mb-[10px]">
                  <Text
                    style={{ fontFamily: "Poppins-Regular" }}
                    className="mb-[10px] text-[#2E2C43]"
                  >
                    Store Description
                  </Text>
                  <View className="flex flex-row items-center justify-between w-[300px] py-[10px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                    <Text
                      className="w-[200px] text-[14px]  text-[#2E2C43]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {user?.storeDescription}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("update-store-description");
                      }}
                      style={{ paddingHorizontal: 20 }}
                    >
                      <EditIcon className="px-[10px]" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="px-[32px] mb-[10px]">
                  <Text
                    style={{ fontFamily: "Poppins-Regular" }}
                    className="mb-[10px] text-[#2E2C43] "
                  >
                    Home Delivery
                  </Text>
                  <View className="flex flex-row items-center justify-between w-[300px] py-[10px]  px-[20px] bg-[#F9F9F9] rounded-[16px]">
                    <TextInput
                      value={user?.homeDelivery === true ? "Yes" : "No"}
                      placeholder={user?.homeDelivery === true ? "Yes" : "No"}
                      placeholderTextColor={"#dbcdbb"}
                      className="w-[240px] text-[14px]  text-[#2E2C43]  capitalize"
                      style={{ fontFamily: "Poppins-Regular" }}
                      multiline={true}
                      scrollEnabled={true}
                      editable={false}
                    />
                    {/* <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("update-service-delivery");
                  }}
                  style={{paddingHorizontal:10}}
                >
                  <EditIcon className="px-[10px]"/>
                </TouchableOpacity> */}
                  </View>
                </View>

                <EditableField
                  label="Mobile Number"
                  value={user.storeMobileNo}
                  editable={false}
                  onChangeText={setStoreMobileNo}
                  onEditPress={() => handleEditPress("storeMobileNo")}
                  onSavePress={() => handleSavePress("storeMobileNo")}
                  isLoading={isLoading}
                />
              </View>

              <View className="px-[32px] flex  gap-[26px] mb-[40px] ">
                <View className="flex-row items-center justify-between  my-[10px]">
                  <Text
                    style={{ fontFamily: "Poppins-Regular" }}
                    className="text-[#2E2C43]"
                  >
                    GST/Labor certificate
                  </Text>
                </View>
                {user?.panCard && (
                  <View className="rounded-[16px] ">
                    <TouchableOpacity
                      className="flex-col"
                      onPress={() => {
                        handleDownloadDocument();
                      }}
                    >
                      <DocumentIcon size={90} />
                      <Text
                        className=" text-[16px] pt-[10px] text-[#fb8c00]"
                        style={{ fontFamily: "Poppins-Medium" }}
                      >
                        View Document
                      </Text>
                      {/* <Text className="pt-[5px]">{fileSize < 1 ? `${(parseFloat(fileSize).toFixed(3) * 1000)} kb` : `${parseFloat(fileSize).toFixed(1)}Mb`}</Text> */}
                    </TouchableOpacity>
                  </View>
                )}
                {!user?.panCard && (
                  <View>
                    <View className="w-[119px] relative h-[164px] flex justify-center items-center rounded-xl bg-gray-300 border-[1px] border-gray-500">
                      <Text
                        className="text-center text-[14px] text-[#2E2C43]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        No Certificates Uploaded
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View className="mb-[40px]">
                <Text
                  className="capitalize text-[#2e2c43]  px-[32px]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Store Reviews
                </Text>

                {feedbackLoading ? (
                  <ActivityIndicator size="small" color="#fb8c00" />
                ) : (
                  <View style={styles.revcontainer}>
                    {feedbacks.length > 0 ? (
                      <ScrollView>
                        {feedbacks
                          .slice(0, showAllReviews ? feedbacks.length : 3)
                          .map((review, index) => (
                            <View
                              key={index}
                              className="shadow-2xl bg-[#7c7c7c] bg-opacity-5"
                              style={{
                                marginBottom: 20,
                                padding: 20,
                                borderRadius: 20,
                              }}
                            >
                              <View className="flex-row items-center gap-[20px] mb-[5px] ">
                                <Text
                                  className="capitalize text-[#2e2c43]  "
                                  style={{ fontFamily: "Poppins-SemiBold" }}
                                >
                                  {review?.senderName}
                                </Text>
                              </View>
                              <View className="w-[50%]">
                                <StarRating rating={review.rating} />
                              </View>

                              <Text
                                style={{
                                  color: "#7c7c7c",
                                  marginTop: 5,
                                  fontFamily: "Poppins-Regular",
                                }}
                              >
                                {review.feedback}
                              </Text>
                            </View>
                          ))}
                      </ScrollView>
                    ) : (
                      <Text
                        style={{
                          color: "#7c7c7c",
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        No reviews yet
                      </Text>
                    )}

                    {!showAllReviews && feedbacks.length > 4 && (
                      <Pressable
                        onPress={() => setShowAllReviews(true)}
                        className=""
                      >
                        <Text className="text-[#fb8c00] text-center">
                          View All
                        </Text>
                      </Pressable>
                    )}
                    {showAllReviews && feedbacks.length > 4 && (
                      <Pressable
                        onPress={() => setShowAllReviews(false)}
                        className=""
                      >
                        <Text className="text-[#fb8c00] text-center">
                          View Less
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fb8c00" />
            </View>
          )}

          <DeleteImageModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            index={indexImg}
          />
          <DeleteProductImage
            modalVisible={modalDelVisible}
            setModalVisible={setModalDelVisible}
            index={indexDelImg}
            productImages={productImages}
            setProductImagesLocal={setProductImagesLocal}
          />
          {modalVisible && <View style={styles.overlay} />}
          {modalDelVisible && <View style={styles.overlay} />}
        </View>
      )}

      {addProduct && <AddProductImages />}
    </>
  );
};

const EditableField = ({
  label,
  value,
  editable,
  onChangeText,
  onEditPress,
  onSavePress,
  isLoading,
}) => (
  <View className="flex flex-col gap-[11px]">
    <View className="flex-row justify-between">
      <Text
        className="text-[14px] text-[#2e2c43]"
        style={{ fontFamily: "Poppins-Regular" }}
      >
        {label}
      </Text>
      {/* {label === "Store Location" && (
        <Pressable
          onPress={() => {
            console.log("refresh");
          }}
        >
          <Text className="text-[14px] text-[#FB8C00]" style={{ fontFamily: "Poppins-Bold" }}>Refresh</Text>
        </Pressable>
      )} */}
    </View>

    <KeyboardAvoidingView className="flex ">
      <View
        className={`flex flex-row items-center justify-between w-[300px]  px-[20px] bg-[#F9F9F9] rounded-[16px]`}
        style={{ backgroundColor: editable ? "#ffe7c8" : "#F9F9F9" }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholder={label}
          placeholderTextColor={"#dbcdbb"}
          multiline={true}
          className={`w-[200px] text-[14px] py-[10px] text-[#2E2C43] ${
            editable ? "" : "capitalize"
          }`}
          style={{ fontFamily: "Poppins-Regular" }}
        />
        {label != "Mobile Number" && (
          <TouchableOpacity
            onPress={editable ? onSavePress : onEditPress}
            style={{ paddingHorizontal: 20 }}
          >
            {editable ? (
              isLoading ? (
                <View className="text-[14px] bg-[#FB8C00] py-[8px] px-[12px] rounded-xl">
                  <ActivityIndicator size="small" color="#ffffff" />
                </View>
              ) : (
                <Text
                  className="text-[14px] bg-[#FB8C00] text-white py-[8px] px-[6px] rounded-xl"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  Save
                </Text>
              )
            ) : (
              <EditIcon className="" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  </View>
);

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name={i <= rating ? "star" : "star-o"}
        size={18}
        color="#fb8c00"
      />
    );
  }
  return <View style={{ flexDirection: "row", gap: 2 }}>{stars}</View>;
};
export default ProfileScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 1,
  },
  modalContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent greyish background
  },
  modalImage: {
    width: 300,
    height: 400,
    borderRadius: 16,
    objectFit: "contain",
  },
  modalImg: {
    width: 300,
    height: 400,
    borderRadius: 16,
    position: "relative",
    objectFit: "contain",
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

  revcontainer: {
    flex: 1,
    paddingHorizontal: 32,
    marginTop: 10,
  },
  reviewContainer: {
    marginBottom: 20,
    paddingBottom: 10,
  },
  customerName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  reviewText: {
    marginTop: 5,
    fontSize: 14,
  },
});
