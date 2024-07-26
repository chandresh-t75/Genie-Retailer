import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
 
  Image
} from "react-native";
import React, { useState } from "react";
import ThreeDots from "../../assets/ThreeDotIcon.svg";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Profile from "../../assets/ProfileIcon2.svg";
import Copy from "../../assets/Copy.svg";

import { useDispatch, useSelector } from "react-redux";
import {
  setBidOfferedPrice,
  setProductWarranty,
} from "../../redux/reducers/bidSlice";
import { TouchableOpacity } from "react-native";
import BackArrow from "../../assets/BackArrow.svg";
import * as Clipboard from 'expo-clipboard';
import DropDown from "../../assets/dropDown.svg";
import DropDownUp from "../../assets/dropDownUp.svg";



const BidOfferedPrice = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {messages, setMessages } = route.params;
  const [offeredPrice, setOfferedPrice] = useState(0);
  const [warranty, setWarranty] = useState(0);
  const [copied, setCopied] = useState(false);
  const requestInfo = useSelector((state) => state.requestData.requestInfo);
  const user=useSelector(state=>state.storeData.userDetails);
  const [requestOpen,setRequestOpen] = useState(false);
  const onlineUser=useSelector(state=>state.requestData.onlineUser)




  const handleOfferedPrice = (offeredPrice) => {
    const parsedPrice = parseFloat(offeredPrice);
    // Check if the parsed value is a valid number
    if (!isNaN(parsedPrice)) {
      // Update the mobile number state with the parsed value
      setOfferedPrice(parsedPrice);
      // Log the mobile number value
      console.log(parsedPrice);
    } else {
      // Handle invalid input (optional)
      setOfferedPrice(0);
      console.error("Invalid price input:", offeredPrice);
    }
  };
  const handleProductWarranty = (warranty) => {
    // Update the mobile number state
    const parsedWarranty = parseFloat(warranty);
    // Check if the parsed value is a valid number
    if (!isNaN(parsedWarranty)) {
      // Update the mobile number state with the parsed value
      setWarranty(parsedWarranty);
      // Log the mobile number value
      console.log(parsedWarranty);
    } else {
      setWarranty(0);
      // Handle invalid input (optional)
      console.error("Invalid warranty input:", warranty);
    }
  };

  const handleNext = () => {
    dispatch(setBidOfferedPrice(offeredPrice));
    dispatch(setProductWarranty(warranty));
    navigation.navigate("bidPreviewPage", {
      offeredPrice,
      user,
      messages,
      setMessages,
    });
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
          <View className=" bg-[#ffe7c8] w-full flex flex-row   items-center py-[30px] pt-[20px]">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ padding:20,zIndex:30,position:"absolute"}}
          >
            <BackArrow  />
          </TouchableOpacity>

            <View className="gap-[9px] px-[50px]">
              <View className="flex-row gap-[18px] items-center">
                <View className="flex items-center justify-center rounded-full bg-white">
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
                className="text-[14px] text-[#2e2c43] "
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
                  ?.split(" ")
                  .slice(0, 12)
                  .join(" ")}...
                
              </Text>
              }
          
            {
              !requestOpen && requestInfo?.requestId?.requestDescription?.length>50 &&  <TouchableOpacity onPress={()=>{setRequestOpen(true)}} style={{flexDirection:"row",gap:4,alignItems:"center"}}>
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
                <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Bold" }}>Send an offer</Text>
                <Text className="text-[#FB8C00] text-[14px]" style={{ fontFamily: "Poppins-Medium" }}>
                    Step 3/3
                  </Text>
              </View>
              <Text style={{ fontFamily: "Poppins-Regular" }} className="text-[#2e2c43]">Your offered price</Text>
              <View className="bg-white p-4 rounded-lg text-center">
                <TextInput
                  onChangeText={handleOfferedPrice}
                  placeholder="Ex: 1200 Rs"
                  placeholderTextColor="#558B2F"
                  keyboardType="numeric"
                  className="text-center  text-[#558B2F]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                />
              </View>
              <Text style={{ fontFamily: "Poppins-Regular" }} className="text-[#2e2c43] ">Product warranty (In months)</Text>
              <View className="bg-white p-4 rounded-lg text-center">
                <TextInput
                  onChangeText={handleProductWarranty}
                  placeholder="Ex; 6 Month"
                  placeholderTextColor="#558B2F"
                  keyboardType="numeric"
                  className="text-center  text-[#558B2F]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                />
              </View>
            </View>
          </KeyboardAvoidingView>

          {/* Spacer View */}
          <View style={{ flex: 1 }} />
        </View>
      </ScrollView>

      {/* Typing Area */}
      <TouchableOpacity
          disabled={!offeredPrice} onPress={handleNext}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 63,
              width: "100%",
              backgroundColor:
              !offeredPrice? "#e6e6e6" : "#FB8C00",
              justifyContent: "center", // Center content vertically
              alignItems: "center", // Center content horizontally
            }}
          >
           
            <Text
              style={{
                fontSize: 18,
                fontFamily:"Poppins-Black",
                color:!offeredPrice? "#888888" : "white",
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
      {/* <View className="absolute bottom-0 left-0 right-0">
        <View className="gap-[20px]">
          <TouchableOpacity disabled={!offeredPrice} onPress={handleNext}>
            <View className="w-full h-[63px] flex items-center justify-center  bg-[#FB8C00] ">
              <Text className=" text-[16px] text-white" style={{ fontFamily: "Poppins-Black" }}>Next</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
};

export default BidOfferedPrice;
