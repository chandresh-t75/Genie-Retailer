import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import ThreeDots from "../../assets/ThreeDotIcon.svg";
import { FontAwesome } from "@expo/vector-icons";
import Copy from "../../assets/Copy.svg";
import * as Clipboard from 'expo-clipboard';


import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Profile from "../../assets/ProfileIcon2.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { setMessages } from '../../redux/reducers/requestDataSlice';
import { socket } from "../utils/socket.io/socket";
import {
  sendCustomNotificationBid,
  
} from "../../notification/notificationMessages";
import BackArrow from "../../assets/arrow-left.svg"
import { setOngoingRequests, setRequestInfo } from "../../redux/reducers/requestDataSlice";
import { setBidImages, setProductWarranty } from "../../redux/reducers/bidSlice";



const BidPreviewPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [images, setImagesLocal] = useState();
  const [loading,setLoading] =useState(false)
  const [copied, setCopied] = useState(false);

  // const [offeredPrice,setOfferedPrice]=useState("");
  // const [user,setUser]=useState();
  // const [requestInfo,setRequestInfo]=useState()
  // console.log("messages of ",messages)
  const { offeredPrice, messages, setMessages } = route.params;
  const requestInfo = useSelector((state) => state.requestData.requestInfo);
  const bidDetails = useSelector((state) => state.bid.bidDetails);
  const bidOfferedPrice = useSelector((state) => state.bid.bidOfferedPrice);
  const bidImages = useSelector((state) => state.bid.bidImages);
  const warranty = useSelector((state) => state.bid.productWarranty);
  const ongoingRequests = useSelector(
    (state) => state.requestData.ongoingRequests || []
  );
  const user=useSelector(state=>state.storeData.userDetails);

  // const messages = useSelector(state => state.requestData.messages);

  // console.log("warranty",warranty);
  // console.log("bidDetails",messages);

  // useEffect(() => {
  //     const fetchData = async () => {
  //         if (route.params) {
  //             const userDataString = await AsyncStorage.getItem("userData");
  //             const userData = JSON.parse(userDataString);
  //             console.log(userData);
  //             setUser(userData);
  //             setRequestInfo(route.params.requestInfo);
  //         }
  //     };

  //     fetchData();
  // }, [route.params]);

  const sendBid = async () => {
    setLoading(true)
    try {
      const formData = new FormData();
    bidImages.forEach((uri, index) => {
      formData.append('bidImages', {
        uri: uri,  // Correctly use the URI property from ImagePicker result
        type: 'image/jpeg', // Adjust this based on the image type
        name: `photo-${Date.now()}.jpg`,
      });
    });

    formData.append('sender', JSON.stringify({  type: "Retailer",
      refId: user?._id, }));
    formData.append('userRequest', requestInfo?.requestId?._id);
    formData.append('message', bidDetails);
    formData.append('bidType', "true");
    formData.append('chat',requestInfo?._id);
    formData.append('bidPrice',bidOfferedPrice);
    formData.append('warranty',warranty);

   

      // console.log("requestinfo", requestInfo);
      // console.log("warranty", warranty);

      const response = await axios.post(
        "http://173.212.193.109:5000/chat/send-message",
        formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      // console.log("res of meassage", response);
      if (response.status === 201) {
        // console.log("messages recieved", response.data);
        socket.emit("new message", response.data);
        let mess = [...messages];
        console.log("query send", mess);
        mess.push(response.data);
        console.log("query update", mess);
       


        setMessages(mess);
        const filteredRequests = ongoingRequests.filter(
          (request) => request._id !==requestInfo._id
        );
        const requests = ongoingRequests.filter(
          (request) => request._id ===requestInfo._id
        );
        console.log("request ongoing",filteredRequests.length,requests.length)
        const updatedRequest={...requests[0],updatedAt:new Date().toISOString(),unreadCount:0}
        const data=[updatedRequest,...filteredRequests];
         dispatch(setOngoingRequests(data));
         dispatch(setRequestInfo(updatedRequest));
         
         const req={
          requestId:updatedRequest?.requestId?._id,
          userId:updatedRequest?.users[0]._id
        };

        const requestId=req?.requestId
        navigation.navigate(`requestPage${requestId}`);

        setLoading(false)
        const token=await axios.get(`http://173.212.193.109:5000/user/unique-token?id=${requestInfo?.customerId._id}`);
        if(token.data.length>0){
        const notification = {
          token:token.data,
           title: user?.storeName,
           body: bidDetails,
           requestInfo: {
            requestId: requestInfo?._id,
            userId: requestInfo?.users[1]._id
          },
           tag: user?._id,
           price: bidOfferedPrice,
           image:response?.data?.bidImages?.length>0?response?.data?.bidImages[0]:"",
           redirect_to: "bargain",
         };
         sendCustomNotificationBid(notification);
         dispatch(setProductWarranty(0));
         dispatch(setBidImages([]));
        }

         
      } else {
        console.error("Error updating message:");
      }
    } catch (error) {
      setLoading(false)
      console.log("error sending message", error);
    }
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
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="relative flex-grow bg-[#ffe7c8]">
          <View className=" bg-[#ffe7c8] w-full flex flex-row  justify-between items-center py-[20px]">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ padding:20,paddingRight:10,zIndex:30}}
          >
            <BackArrow  />
          </TouchableOpacity>

            <View className="gap-[9px]">
              <View className="flex-row gap-[18px] items-center">
                <View className="flex items-center justify-center rounded-full ml-4 bg-white p-[4px]">
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
                  className="text-[14px]  text-[#2e2c43] capitalize"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {requestInfo?.customerId?.userName?.substring(0,20)}
                  {
                    requestInfo?.customerId?.userName?.length>20 && <Text>...
                      </Text>
                  }
                </Text>
                  <Text className="text-[12px] text-[#79B649]" style={{ fontFamily: "Poppins-Regular" }}>
                  Online
                </Text>
                </View>
              </View>
            </View>

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
            <TouchableOpacity onPress={() => {copyToClipboard()}} style={{padding:4}}>
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

          <View className="flex gap-[21px]  pt-[10px] pb-[100px]">
            <View className="flex-row justify-between px-[40px]">
              <Text className="" style={{ fontFamily: "Poppins-Bold" }}>Preview your offer response</Text>
            </View>
            <View className="px-[40px]">
              {/* <Text>{user?.storeOwnerName}</Text> */}
              <Text style={{ fontFamily: "Poppins-Regular" }}>{bidDetails}</Text>
            </View>
            <View className="gap-[10px]">
              <Text className=" text-[14px] px-[40px]" style={{ fontFamily: "Poppins-SemiBold" }}>
                Reference Images
              </Text>
              {bidImages ? (
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                     paddingLeft:40,
                      flexDirection: "row",
                      gap: 8,
                  }}
                >
                 
                    {bidImages &&
                      bidImages?.map(
                        (
                          image,
                          index // Start from index 1 to exclude the first image
                        ) => (
                          <View key={index} className="rounded-3xl">
                            <Image
                              source={{ uri: image }}
                              width={100}
                              height={140}
                              className="rounded-3xl border-[1px] border-slate-400 object-contain"
                            />
                          </View>
                        )
                      )}
                 
                </ScrollView>
              ) : (
                <View className="flex-row gap-[10px] px-[40px]">
                  <View className="h-[140px] w-[100px] rounded-3xl bg-white "></View>
                  <View className="h-[140px] w-[100px] rounded-3xl bg-white"></View>
                </View>
              )}
            </View>
            <View className="gap-[0px] px-[40px]">
              <Text className=" text-[14px]" style={{ fontFamily: "Poppins-SemiBold" }}>Offered Price</Text>
              <Text className=" text-[24px] text-[#558B2F]" style={{ fontFamily: "Poppins-Bold" }}>
                 {bidOfferedPrice?`Rs ${bidOfferedPrice}`:"Na"}
              </Text>
            </View>
            <View className="gap-[0px] px-[40px]">
              <Text className=" text-[14px]" style={{ fontFamily: "Poppins-SemiBold" }}>
                Product Warranty
              </Text>
              <Text className=" text-[24px] text-[#558B2F]" style={{ fontFamily: "Poppins-Bold" }}>
                {warranty?`${warranty} Months`:"Na"}
              </Text>
            </View>
          </View>

          {/* Spacer View */}
          <View style={{ flex: 1 }} />
        </View>
      </ScrollView>

      {/* Typing Area */}
      <View className="absolute bottom-0 left-0 right-0">
        <View className="gap-[20px]">
          <TouchableOpacity onPress={sendBid}>
            <View className="w-full h-[63px] flex items-center justify-center  bg-[#FB8C00] ">
            {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
              <Text className="text-[16px] text-white" style={{ fontFamily: "Poppins-Black" }}>Send Offer</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BidPreviewPage;
