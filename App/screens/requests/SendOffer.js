import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ArrowLeft from "../../assets/BackArrow.svg";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { socket } from "../utils/socket.io/socket";
// import UploadImage from "../../assets/ClickImg.svg";
import UploadImage from "../../assets/AddMoreImg.svg";
import Close from "../../assets/delImgOrange.svg";

import ErrorOffer from "../../assets/ErrorOffer.svg";
import { baseUrl } from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";
import UnableToSendMessage from "../../components/UnableToSendMessage";
import {
  setCurrentRequest,
  setOngoingRequests,
  setRequestInfo,
} from "../../redux/reducers/requestDataSlice";
import { sendCustomNotificationBid } from "../../notification/notificationMessages";
import {
  setBidImages,
  setProductWarranty,
} from "../../redux/reducers/bidSlice";
import AddImages from "./AddImages";
import ModalCancel from "../../components/ModalCancel";

const SendOffer = () => {
  const route = useRoute();
  const { messages, setMessages } = route.params;
  // const details = route.params.data;
  const requestInfo = useSelector((state) => state.requestData.requestInfo);
  // const bidDetails = useSelector((state) => state.bid.bidDetails);
  // const bidOfferedPrice = useSelector((state) => state.bid.bidOfferedPrice);
//   const bidImages = useSelector((state) => state.bid.bidImages);
  // const warranty = useSelector((state) => state.bid.productWarranty);
  const navigation = useNavigation();
  const [price, setPrice] = useState(null);
  const [query, setQuery] = useState("");
  const [warranty, setWarranty] = useState(null);
  const dispatch = useDispatch();
  const [addImg, setAddImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector((state) => state.storeData.userDetails);
  const accessToken = useSelector((state) => state.storeData.accessToken);
  const onlineUser = useSelector((state) => state.requestData.onlineUser);
  const ongoingRequests = useSelector(
    (state) => state.requestData.ongoingRequests || []
  );
  //   const [requestImages,setRequestImages]=useState([])
  const [bidImages,setBidImages]=useState([]);
  const [imgIndex, setImgIndex] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  console.log("bidImages", bidImages);
//   console.log("requestinfo", requestInfo);
  

  const sendBid = async () => {
    setLoading(true);
    const warrantyLocal=Number(warranty)
    const priceLocal=Number(price);
    console.log("warranty", warrantyLocal,"price", priceLocal);
    
    try {
      const formData = new FormData();
      if(bidImages){
      bidImages?.forEach((uri, index) => {
        formData.append("bidImages", {
          uri: uri,
          type: "image/jpeg",
          name: `photo-${Date.now()}.jpg`,
        });
      });
    }
   

      formData.append(
        "sender",
        JSON.stringify({ type: "Retailer", refId: user?._id })
      );
      formData.append("userRequest", requestInfo?.requestId?._id);
      formData.append("message", query);
      formData.append("bidType", "true");
      formData.append("chat", requestInfo?._id);
      formData.append("bidPrice", priceLocal);
      formData.append("warranty", warrantyLocal);
  console.log("formDta",formData)
 
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axiosInstance
        .post(`${baseUrl}/chat/send-message`, formData, config)
        .then(async (response) => {
          if (response.status === 200) {
            setOpenModal(true);
          
          }
          if (response.status !== 201) return;
          // console.log("messages recieved", response.data);
          socket.emit("new message", response.data);
          // let mess = [...messages];
          // // console.log("query send", mess);
          // mess.push(response.data);
          // // console.log("query update", mess);

          // setMessages(mess);
          setMessages((prevMessages) => [...prevMessages, response.data]);
          const filteredRequests = ongoingRequests.filter(
            (request) => request._id !== requestInfo._id
          );
          const requests = ongoingRequests.filter(
            (request) => request._id === requestInfo._id
          );
          console.log(
            "request ongoing",
            filteredRequests.length,
            requests.length
          );
          const updatedRequest = {
            ...requests[0],
            updatedAt: new Date().toISOString(),
            unreadCount: 0,
          };
          const data = [updatedRequest, ...filteredRequests];
          dispatch(setOngoingRequests(data));
          dispatch(setRequestInfo(updatedRequest));

          const req = {
            requestId: updatedRequest?._id,
            userId: updatedRequest?.users[0]._id,
            senderId: updatedRequest?.users[1]._id,
          };
          dispatch(setCurrentRequest(req));

          const requestId = req?.requestId;
          navigation.navigate(`requestPage${requestId}`);

          setLoading(false);
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          };
          const token = await axiosInstance.get(
            `${baseUrl}/user/unique-token?id=${requestInfo?.customerId._id}`,
            config
          );
          console.log("token",token.data,requestInfo)
          if (token.data.length > 0) {
            const notification = {
              token: token.data,
              title: user?.storeName,
              body: query,
              requestInfo: {
                requestId: requestInfo?._id,
                userId: requestInfo?.users[1]._id,
                senderId: requestInfo?.users[0]._id,
              },
              tag: user?._id,
              price: price,
              image:
                response?.data?.bidImages?.length > 0
                  ? response?.data?.bidImages[0]
                  : "",
              redirect_to: "bargain",
            };
            sendCustomNotificationBid(notification);
            dispatch(setProductWarranty(0));
            dispatch(setBidImages([]));
            setBidImages([]);
            setQuery("");
            setPrice(null);
            setWarranty(null);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log("error sending message", error);
    }
  };

  const handleClose = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };
  const handleImagePress = (image) => {
    setSelectedImage(image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const scrollViewRef = useRef(null);
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [bidImages]);

  const deleteImage = (index) => {
    setImgIndex(index);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <ScrollView className="mb-[100px]">
          <View className=" flex z-40 flex-row items-center justify-center mt-[20px] mb-[24px] mx-[36px]">
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft />
            </Pressable>
            <Text
              className="flex flex-1 justify-center text-[#2e2e43] items-center text-center text-[16px]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Send new offer
            </Text>
          </View>
          
          <View className="px-[30px] mt-[30px]">
            <Text
              className="text-[14px]  text-[#2e2c43] pb-[20px]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Add product images
            </Text>
            
             

              <View className="flex flex-row items-center gap-[11px] mb-[10px]">
                <TouchableOpacity
                  onPress={() => {
                    setAddImg(!addImg);
                  }}
                >
                  <View>
                    <UploadImage />
                  </View>
                </TouchableOpacity>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{
                    alignSelf: "flex-start",
                  }}
                >
                  <View className="px-[20px] flex flex-row items-center gap-[11px] w-max">
                    {console.log(Array.isArray(bidImages))}
                    {Array.isArray(bidImages) &&
                      bidImages.map((image, index) => (
                        <View key={index}>
                          <Pressable
                            onPress={() => {
                              handleImagePress(image);
                            }}
                          >

<View style={styles.imageWrapper}>
                              <Image
                                source={{ uri: image }}
                                style={{
                                    height: 232,
                                    width: 174,
                                    borderRadius: 24,
                                    backgroundColor: "#EBEBEB",
                                  }}
                              />
                              <Pressable
                                onPress={() => deleteImage(index)}
                                style={styles.deleteIcon}
                              >
                                <Close width={24} height={24}/>
                              </Pressable>
                            </View>
                            {/* <Image
                              source={{ uri: image }}
                              style={{
                                height: 232,
                                width: 174,
                                borderRadius: 24,
                                backgroundColor: "#EBEBEB",
                              }}
                              <Pressable
                                onPress={() => deleteImage(index)}
                                style={styles.deleteIcon}
                              >
                                <Close width={24} height={24}/>
                              </Pressable> */}
                            {/* /> */}
                          </Pressable>
                        </View>
                      ))}
                  </View>
                </ScrollView>
              </View>
            
    
          </View>

          <View className="mt-[35px] mx-[28px] mb-[60px]">
            <Text
              className="text-[14px] text-[#2e2c43] mx-[6px]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Your offered price
            </Text>
            <TextInput
              placeholder="Ex:1,200 Rs"
              value={price}
              onChangeText={(val) => {
                setPrice(val);
              }}
              keyboardType="numeric"
              placeholderTextColor={"#558b2f"}
              className="text-[14px] text-center bg-[#ffc882] text-[#558b2f]  mt-[20px]  rounded-3xl px-[20px] py-[10px] "
              style={{ fontFamily: "Poppins-Bold" }}
            />
            {/* <Text className="text-[14px] text-[#2e2c43] mt-[20px]" style={{ fontFamily: "Poppins-Regular" }}>
                Please tell the vendor the price that you feel is right.{" "}
              </Text> */}
            <Text
              className="text-[14px] text-[#2e2c43] mx-[6px] mt-[20px]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Product Warranty (In Months)
            </Text>
            <TextInput
              placeholder="Ex:6 Months"
              value={warranty}
              onChangeText={(val) => {
                setWarranty(val);
              }}
              keyboardType="numeric"
              placeholderTextColor={"#558b2f"}
              className="text-[14px] text-center bg-[#ffc882] text-[#558b2f]  mt-[20px]  rounded-3xl px-[20px] py-[10px] "
              style={{ fontFamily: "Poppins-Bold" }}
            />

            <Text
              className="text-[14px]  text-[#2e2c43] mx-[6px] mt-[30px] mb-[15px]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Type your message
            </Text>

            <View className="  h-[127px] bg-[#f9f9f9] rounded-xl ">
              <TextInput
                multiline
                numberOfLines={6}
                onChangeText={(val) => {
                  setQuery(val);
                }}
                value={query}
                placeholder="Type here..."
                placeholderTextColor="#dbcdbb"
                className="w-full h-[127px] overflow-y-scroll px-[20px] border-[0.3px] border-[#2e2c43] rounded-xl "
                style={{
                  padding: 20,
                  height: 300,
                  flex: 1,
                  textAlignVertical: "top",
                  fontFamily: "Poppins-Regular",
                }}
              />
            </View>
          </View>

        </ScrollView>
        <TouchableOpacity
          disabled={!price || query.length == 0 || loading}
          onPress={() => {
            sendBid();
          }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 63,
            width: "100%",
            backgroundColor:!price || query.length === 0 ? "#e6e6e6" : "#FB8C00",
            justifyContent: "center", // Center content vertically
            alignItems: "center", // Center content horizontally
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text
              style={{
                fontSize: 18,
                color: !price || query.length === 0 ? "#888888" : "white",
                fontFamily: "Poppins-Black",
              }}
              
            >
              Send an offer
            </Text>
          )}
        </TouchableOpacity>
        {addImg && <AddImages addImg={addImg} setAddImg={setAddImg} bidImages={bidImages} setBidImages={setBidImages} />}
      </View>
      <Modal transparent visible={!!selectedImage} onRequestClose={handleClose}>
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
      {openModal && (
        <UnableToSendMessage
          openModal={openModal}
          setOpenModal={setOpenModal}
          errorContent="The offer can not be sent because the customer sent you the new offer.Please accept or reject the customer's offer before sending the new offer"
          ErrorIcon={ErrorOffer}
        />
      )}

<ModalCancel
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            imagesLocal={bidImages}
            setImagesLocal={setBidImages}
            index={imgIndex}
          />
          {modalVisible && <View style={styles.overlay} />}
    </View>
  );
};

export default SendOffer;
const styles = StyleSheet.create({
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
  imageWrapper: {
    margin: 5,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "gray",
  },
  progressContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  progress: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 50,
    borderWidth: 3,
  },
  progressText: {
    color: "white",
    fontSize: 16,
  },
  progresstext: {
    color: "green",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    width: "100%",
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent greyish background
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 2,
  },
});
