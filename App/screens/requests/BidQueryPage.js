import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import ThreeDots from "../../assets/ThreeDotIcon.svg";
import { FontAwesome } from "@expo/vector-icons";

import Copy from "../../assets/Copy.svg";
import Document from "../../assets/Document.svg";
import Send from "../../assets/Send.svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Profile from "../../assets/ProfileIcon2.svg";

import axios from "axios";
import { socket } from "../utils/socket.io/socket";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, setOngoingRequests, setRequestInfo } from "../../redux/reducers/requestDataSlice";
import { sendCustomNotificationChat } from "../../notification/notificationMessages";
import BackArrow from "../../assets/BackArrow.svg";
import * as Clipboard from 'expo-clipboard';
import { baseUrl } from "../utils/constants";



const BidQueryPage = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [query, setQuery] = useState("");
  const {  messages, setMessages } = route.params;
  const requestInfo = useSelector((state) => state.requestData.requestInfo);
  const [loading,setLoading]=useState(false)
  const [copied, setCopied] = useState(false);

  const ongoingRequests = useSelector(
    (state) => state.requestData.ongoingRequests || []
  );
  const user=useSelector(state=>state.storeData.userDetails);
  const accessToken = useSelector((state) => state.storeData.accessToken)


  // const messages = useSelector(state => state.requestData.messages);
  // console.log("messages of ",messages);

  // useEffect(() => {
  //     if (route.params) {
  //         setUser(route.params.user);
  //         setRequestInfo(route.params?.requestInfo);
  //         //         // console.log('images', images);
  //         //         // console.log('route.params.data', route.params.data);
  //     }
  // }, [route.params])
  
  const sendQuery = async () => {
    setLoading(true)
    console.log("requestInfo",requestInfo);
    try {
      const formData = new FormData();
     
  
      formData.append('sender', JSON.stringify({  type: "Retailer",
        refId: user?._id, }));
      formData.append('userRequest', requestInfo?.requestId?._id);
      formData.append('message',query);
      formData.append('bidType', "false");
      formData.append('chat',requestInfo?._id);
      formData.append('bidPrice',0);
      formData.append('warranty',0);
      formData.append('bidImages',[]);
     

      const config = {
        headers:{
          'Content-Type':'multipart/form-data',
          'Authorization':`Bearer ${accessToken}`,
        }
       }
      const response = await axios.post(
        `${baseUrl}/chat/send-message`,
        formData,config
      );
        //  console.log("res",response);
      if (response.status === 201) {
        //  console.log("messages recieved",response.data);

        socket.emit("new message", response.data);
        let mess = [...messages];
        //  console.log("query send",mess);
        mess.push(response.data);
        //  console.log("query update",mess);

        //  dispatch(setMessages(mess));
        setMessages(mess);
        const filteredRequests = ongoingRequests.filter(
          (request) => request?._id !==requestInfo?._id
        );
        const requests = ongoingRequests.filter(
          (request) => request?._id ===requestInfo?._id
        );
        const updatedRequest={...requests[0],updatedAt:new Date().toISOString(),unreadCount:0}
        //             // console.log("request ongoing",requests[0]?.updatedAt, new Date().toISOString());
       
        // console.log("request ongoing",filteredRequests.length,requests.length,updatedRequest)
        const data=[updatedRequest,...filteredRequests];
         dispatch(setOngoingRequests(data));
         dispatch(setRequestInfo(updatedRequest));
         const req={
          requestId:updatedRequest?._id,
          userId:updatedRequest?.users[0]._id
        };
        
       
        // console.log("notification", notification.requestInfo);
        const requestId=req?.requestId
        navigation.navigate(`requestPage${requestId}`);

        setLoading(false)
        const config = {
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${accessToken}`,
          }
         }
        const token=await axios.get(`${baseUrl}/user/unique-token?id=${requestInfo?.customerId?._id}`,config);
        console.log("token",token.data);
        if(token.data.length > 0){
        const notification = {
          token:token.data,
          title: user?.storeName,
          body: query,
          requestInfo: {
            requestId: requestInfo?._id,
            userId: requestInfo?.users[1]._id
          },
          tag: user?._id,
          redirect_to: "bargain",
        };
        sendCustomNotificationChat(notification);
         }
        //  console.log("res after sending notification ",res);
        //   try{
        //  const res=await axios.get(`http://localhost:3000/send-notification-chat?name=Rohit&body=Hii how are you&redirect_to=requestPage&requestInfo={"__v": 1, "_id": "66532414ff164bf94697251d", "bidCompleted": true, "createdAt": "2024-05-26T11:59:16.279Z", "requestId": {"__v": 0, "_id": "66532414ff164bf94697251b", "createdAt": "2024-05-26T11:59:16.052Z", "customer": "664d6fb333bcb1bbd6cf9f66", "expectedPrice": 2500, "requestAcceptedChat": "66532414ff164bf94697251d", "requestActive": "completed", "requestCategory": "spare parts", "requestDescription": "bike tyre", "requestImages": ["https://res.cloudinary.com/kumarvivek/image/upload/v1716724746/zznnqcnga7ktx9v4vlto.jpg"], "updatedAt": "2024-05-26T12:00:58.405Z"}, "requestType": "completed", "updatedAt": "2024-05-26T12:00:58.844Z", "users": [{"_id": "66532414ff164bf94697251e", "refId": "664d74f100215ea2aea8a35d", "type": "Retailer"}, {"_id": "66532437ff164bf94697252e", "refId": "66532414ff164bf94697251b", "type": "UserRequest"}]}`)
        //     console.log("res after sending notification ",res);

        //   }
        //   catch(err){
        //     console.log("error sending notification",err);
        //   }
        setQuery("");
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
        <View className="relative  flex-grow bg-[#ffe7c8]">
          <View className=" bg-[#ffe7c8] w-full flex relative flex-row  justify-between items-center py-[20px]">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ padding:20,zIndex:30}}
          >
            <BackArrow  />
          </TouchableOpacity>

            <View className="gap-[9px] w-[100%]">
              <View className="flex-row  gap-[18px] items-center">
                <View className="flex   items-center justify-center rounded-full  bg-white">
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
                <View className="">
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
          <View className="px-[50px] pb-[20px] flex bg-[#ffe7c8]">
            <View className="gap-[0px] relative ">
              <Text
                className="text-[14px] text-[#2e2c43]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Request Id:
              </Text>
              <View className="flex flex-row gap-2 items-center">
              <Text style={{ fontFamily: "Poppins-Regular" }}>
                {requestInfo?.requestId?._id}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  copyToClipboard();
                }}
                style={{ padding: 4 }}
              >
                <Copy />
              </TouchableOpacity>
              {copied && (
                <Text className="bg-[#ebebeb] p-2 rounded-lg absolute -top-10 right-0">
                  Copied!
                </Text>
              )}
              </View>
              
             
            </View>
            <Text style={{ fontFamily: "Poppins-Regular" }} className="text-[#2e2c43] mt-[10px]">
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
          <KeyboardAvoidingView>
            <View className="flex gap-[21px] px-[50px] pt-[10px] pb-[100px]">
              <View className="flex-row justify-between">
                <Text className="text-[#2e2c43]" style={{ fontFamily: "Poppins-Bold" }}>Send Message</Text>
                {/* <Text>Step 1/3</Text> */}
              </View>
              {/* <Text style={{ fontFamily: "Poppins-Regular" }}>Type your response here to the customer</Text> */}
              <View className="bg-white p-4 rounded-lg">
                <TextInput
                  multiline
                  numberOfLines={5}
                  placeholder="Start typing here"
                  placeholderTextColor="#dbcdbb"
                  classname=" "
                  onChangeText={(text) => setQuery(text)}
                  style={{ fontFamily: "Poppins-Regular" }}
                />
              </View>
            </View>
          </KeyboardAvoidingView>

          {/* Spacer View */}
          <View style={{ flex: 1 }} />
        </View>
      </ScrollView>

      
        <TouchableOpacity
           disabled={!query} 
           onPress={sendQuery}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 63,
              width: "100%",
              backgroundColor:
              !query? "#e6e6e6" : "#FB8C00",
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
                fontFamily:"Poppins-Black",
                color: !query ? "#888888" : "white",
              }}
            >
              Next
            </Text>)}
          </TouchableOpacity>

    </View>
  );
};

export default BidQueryPage;
