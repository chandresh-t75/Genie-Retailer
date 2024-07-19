import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import StoreName from "../../assets/delivery.svg";
import BackArrow from "../../assets/BackArrow.svg";

import { useDispatch } from "react-redux";
import { setStoreService } from "../../redux/reducers/storeDataSlice";
import { Octicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const ServiceDeliveryScreen = () => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const { width } = Dimensions.get("window");

  const handleService = () => {
    try {
      dispatch(setStoreService(checked));
      navigation.navigate("panCard");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View className="w-full flex-col justify-center">
            {/* <View className="w-full absolute top-10 left-10 z-40 mt-[10px] flex flex-row justify-between items-center px-[32px]"> */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: "absolute",
                top: 50,
                left: 30,
                padding: 15,
                zIndex: 40,
                // backgroundColor: 'black'
              }}
            >
              <BackArrow width={16} height={12} />
            </TouchableOpacity>
            {/* </View> */}
            <StoreName width={width} className="object-cover " />
            <View className="flex flex-col justify-center items-center px-[32px] gap-[20px] ">

              <Text
                className="text-[14.5px]  text-[#FB8C00]"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Step 5/6
              </Text>
            </View>
            <View className="my-[30px] flex flex-col gap-[33px] px-[32px]">
              <View className="flex flex-col gap-[17px]">
                <Text
                  className="text-[16px] text-[#2e2c43]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Do you provide home delivery or service at the customer's
                  doorstep?
                </Text>
                <KeyboardAvoidingView className="flex flex-col gap-[22px]">
                  <Pressable
                    className="flex flex-row items-center gap-[22px]"
                    onPress={() => setChecked(true)}
                  >
                    <View
                      className={`border-[#FB8C00] h-[20px] w-[20px] flex justify-center items-center border-[1px] rounded-full ${checked === true ? "bg-[#FB8C00]" : ""
                        }`}
                    >
                      {checked === true && (
                        <Entypo name="circle" size={16} color="white" />
                      )}
                    </View>
                    <Text
                      className="text-[#2E2C43] text-[16px] "
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      Yes
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex flex-row items-center gap-[22px]"
                    onPress={() => setChecked(false)}
                  >
                    <View
                      className={`border-[#FB8C00] h-[20px] w-[20px] flex justify-center items-center border-[1px] rounded-full ${checked === false ? "bg-[#FB8C00]" : ""
                        }`}
                    >
                      {checked === false && (
                        <Entypo name="circle" size={16} color="white" />
                      )}
                    </View>
                    <Text
                      className="text-[#2E2C43] text-[16px] "
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      No
                    </Text>
                  </Pressable>
                </KeyboardAvoidingView>
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={handleService}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fb8c00",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 18,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins-Black",
              color: "white",
              textAlign: "center",
            }}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceDeliveryScreen;
