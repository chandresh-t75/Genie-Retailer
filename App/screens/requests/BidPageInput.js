import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity
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
import { setBidDetails } from "../../redux/reducers/bidSlice";
import { useDispatch, useSelector } from "react-redux";
import BackArrow from "../../assets/BackArrow.svg";

import * as Clipboard from 'expo-clipboard';
import DropDown from "../../assets/dropDown.svg";
import DropDownUp from "../../assets/dropDownUp.svg";



const BidPageInput = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { messages, setMessages } = route.params;
  const requestInfo = useSelector((state) => state.requestData.requestInfo);
  // const messages=route.params.messages;
  const [bidDetails, setBidDetailsLocal] = useState("");
  const [copied, setCopied] = useState(false);
  const user=useSelector(state=>state.storeData.userDetails);
  const [requestOpen,setRequestOpen] = useState(false);
  const onlineUser=useSelector(state=>state.requestData.onlineUser)




  // const messages = useSelector(state => state.requestData.messages);
  // console.log("messages of ",messages)

  // useEffect(() => {
  //     if (route.params) {
  //         setUser(route.params.user);
  //         setRequestInfo(route.params.requestInfo);
  //         //         // console.log('images', images);
  //         //         // console.log('route.params.data', route.params.data);
  //     }
  // }, [])

  const handleBidDetails = (bidDetails) => {
    // Update the mobile number state
    setBidDetailsLocal(bidDetails);
    // Log the mobile number value
    // console.log(bidDetails);
  };

  const handleNext = () => {
    dispatch(setBidDetails(bidDetails));
    navigation.navigate("bidPageImageUpload", { user, messages, setMessages });
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
            style={{ padding:20,paddingRight:5,zIndex:100}}
          >
            <BackArrow  />
          </TouchableOpacity>

            <View className="gap-[9px]">
              <View className="flex-row gap-[18px] items-center">
                <View className="flex items-center justify-center rounded-full ml-4 bg-white">
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
                <View className="w-[100%]">
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
                {onlineUser && (
                    <Text
                      className="text-[12px] text-[#79B649]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      Online
                    </Text>
                  )}
                  {!onlineUser && (
                    <Text
                      className="text-[12px] text-[#7c7c7c]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      Offline
                    </Text>
                  )}
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
            <View className=" gap-2 mt-[10px]">
              {
                requestOpen && 
                <Text
                style={{ fontFamily: "Poppins-Regular" }}
                className="text-[#2e2c43] flex items-center"
              >
                {requestInfo?.requestId?.requestDescription}
                
              </Text>
              }
              {
               !requestOpen && 
                <Text
                style={{ fontFamily: "Poppins-Regular" }}
                className="text-[#2e2c43] flex items-center"
              >
                 {requestInfo?.requestId?.requestDescription
                  ?.substring(0,50)}...
                
              </Text>
              }
          
            {
              !requestOpen && requestInfo?.requestId?.requestDescription?.length>50 && <TouchableOpacity onPress={()=>{setRequestOpen(true)}} style={{flexDirection:"row",gap:4,alignItems:"center"}}>
              <Text style={{ fontFamily: "Poppins-SemiBold" }} className="text-[#fc8b00]">View More</Text>
                  <DropDown width={14} height={16} />
                 
            </TouchableOpacity>
            }
            {
              requestOpen &&  requestInfo?.requestId?.requestDescription?.length>50 &&
              <TouchableOpacity onPress={()=>{setRequestOpen(false)}} style={{flexDirection:"row",gap:4,alignItems:"center"}}>
                <Text style={{ fontFamily: "Poppins-SemiBold" }}
                className="text-[#fc8b00]">View Less</Text>
              <DropDownUp width={14} height={16} />
              </TouchableOpacity>
            }
          
            
            </View>
           
            {/* {
              route.params?.data ? ( <Text>{req?.requestId?.requestDescription}</Text>):( <Text>{requestInfo?.requestId?.requestDescription}</Text>)
            } */}
          </View>
          <KeyboardAvoidingView>
            <View className="flex gap-[21px] px-[50px] pt-[10px] pb-[100px]">
              <View className="flex-row justify-between">
                <Text className="text-[#2e2c43]" style={{ fontFamily: "Poppins-Bold" }}>Send an offer</Text>
                <Text className="text-[#FB8C00] text-[14px] " style={{ fontFamily: "Poppins-Medium" }}>Step 1/3</Text>
              </View>
              <Text style={{ fontFamily: "Poppins-Regular" }} className="text-[#2e2c43]">Type your message here to the customer</Text>
              <View className="bg-white p-4 rounded-lg flex w-full">
                <TextInput
                  multiline
                  numberOfLines={5}
                  placeholder="Start typing here"
                  placeholderTextColor="#dbcdbb"
                  classname="w-full p-4"
                  onChangeText={handleBidDetails}
                  style={{ fontFamily: "Poppins-Regular" ,  textAlignVertical: 'top',}}
                />
              </View>
            </View>
          </KeyboardAvoidingView>

          {/* Spacer View */}
          <View style={{ flex: 1 }} />
        </View>
      </ScrollView>

    
        <TouchableOpacity
           disabled={!bidDetails} 
           onPress={handleNext}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 63,
              width: "100%",
              backgroundColor:
              !bidDetails? "#e6e6e6" : "#FB8C00",
              justifyContent: "center", // Center content vertically
              alignItems: "center", // Center content horizontally
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily:"Poppins-Black",
                color: !bidDetails ? "#888888" : "white",
              }}
            >
              Next
            </Text>
          </TouchableOpacity>

    </View>
  );
};

export default BidPageInput;
