import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
  Platform,
  Dimensions
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import MobileNumberImg from "../../assets/mobile.svg";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  setMobileNumber,
  setPanCard,
  setUniqueToken,
  setUserDetails,
  storeClear,
} from "../../redux/reducers/storeDataSlice.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import messaging from "@react-native-firebase/messaging";
import BackArrow from "../../assets/BackArrow.svg";
// import SmsRetriever from 'react-native-sms-retriever';



const MobileNumberEntryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const route=useRout()
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const route = useRoute();
  const [mobileNumber, setMobileNumberLocal] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [mobileScreen, setMobileScreen] = useState(true);
  const countryCode = "+91";
  const loginScreen = true;
  const uniqueToken = useSelector((state) => state.storeData.uniqueToken);
  const navigationState = useNavigationState((state) => state);
  const isLoginScreen = navigationState.routes[navigationState.index].name === "mobileNumber";
  console.log("mobil", isLoginScreen);
  const { width } = Dimensions.get("window");


  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log("token", token);
          setToken(token);
          dispatch(setUniqueToken(token));
        });
    } else {
      console.log("permission not granted", authStatus);
    }
  }, [route.params]);

  useEffect(() => {
    const backAction = () => {
      // If on OTP screen, set mobileScreen to true to go back to mobile number entry screen
      if (!mobileScreen) {
        setMobileScreen(true);
        return true; // Prevent default back action
      }
      else if (isLoginScreen) {
        BackHandler.exitApp();
        return true;
      }

      return false;
    };

    // Add event listener for hardware back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up event listener
    return () => backHandler.remove();
  }, [mobileScreen]);




  const handleMobileNo = (mobileNumber) => {
    // Update the mobile number state
    setMobileNumberLocal(mobileNumber);

    // Log the mobile number value
    // console.log(mobileNumber);
  };

  const handleOtp = (otp) => {
    setOtp(otp);
    console.log(otp);
  };

  // useEffect(() => {
  //   const startSmsRetriever = async () => {
  //     try {
  //       const registered = await SmsRetriever.startSmsRetriever();
  //       if (registered) {
  //         SmsRetriever.addSmsListener(event => {
  //           const message = event.message;
  //           const otpRegex = /\b\d{6}\b/; // Adjust the regex based on your OTP format
  //           const extractedOtp = message.match(otpRegex);
  //           if (extractedOtp) {
  //             setOtp(extractedOtp[0]);
  //             SmsRetriever.removeSmsListener();
  //           }
  //         });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   startSmsRetriever();

  //   return () => {
  //     SmsRetriever.removeSmsListener();
  //   };
  // }, []);

  const sendVerification = async () => {

    if (mobileNumber.length === 10) {
      // Navigate to OTP screen if the phone number is valid
      setLoading(true);
      dispatch(setPanCard(""));
      // dispatch(storeClear());
      try {
        const phoneNumber = countryCode + mobileNumber;
        // console.log(phoneNumber);
        // const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        // setConfirm(confirmation);
        // console.log(confirmation);

        dispatch(setMobileNumber(phoneNumber));
        setMobileScreen(false);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    } else {
      // Display an alert if the phone number is invalid
      alert("Please enter correct mobile number.");
    }
  };

  //   const ConfirmCode=async()=>{
  //      const credentials=await confirm.confirm(code);
  //      const user=credentials.user;
  //      console.log(user);
  //   }

  const checkMobileNumber = async () => {
    setIsLoading(true);
    try {
      // Make a request to your backend API to check if the mobile number is registered

      //  console.log(confirm) 
      //  const res=await confirm.confirm(otp);
      //  console.log("res",res);
      // console.log(otp);
      // if(res.status===200 || res?.user?.phoneNumber?.length>0){
      const phoneNumber = countryCode + mobileNumber;
      console.log("phone", phoneNumber);
      const response = await axios.get(
        "http://173.212.193.109:5000/retailer/",
        {
          params: {
            storeMobileNo: phoneNumber,
          },
        }
      );
      console.log("res", response);

      if (response.data.storeMobileNo) {
        // If mobile number is registered, navigate to home screen


        const result = await axios.patch(
          `http://173.212.193.109:5000/retailer/editretailer`,
          {
            _id: response?.data?._id,
            uniqueToken: token,
          }
        );
        dispatch(setUserDetails(result.data));
        await AsyncStorage.setItem("userData", JSON.stringify(result.data));

        setToken("");
        if (response.data.storeApproved) {
          navigation.navigate("home", { data: "" });
        }
        else {
          navigation.navigate("completeProfile");
        }
        setOtp("");
        setMobileNumberLocal("");
        setMobileScreen(true);
      } else if (response.data.status === 404) {
        // If mobile number is not registered, continue with the registration process

        navigation.navigate("registerUsername");
        setOtp("");
        setToken("")
        setMobileNumberLocal("");
        setMobileScreen(true);
      }
      // }
      // else{
      //   setLoading(false);
      //   console.log('Invalid otp:');
      //   alert('Invalid otp');
      //   return;
      // }
    } catch (error) {
      console.log("Invalid otp:", otp);
      alert("Invalid otp");
      console.error("Error checking mobile number:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {mobileScreen && (
        <View style={{ flex: 1, backgroundColor: "white" }}>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <KeyboardAvoidingView behavior="position">
              <View style={{ flex: 1, backgroundColor: "white", paddingBottom: 30 }}>
                <View className="bg-white flex-col justify-center">
                  <View className="flex flex-col justify-center items-center gap-[20px]">
                    <MobileNumberImg
                      // height={400}
                      width={width}
                      className="object-cover"
                    />
                    <Text className="text-[14.5px]  text-[#FB8C00]" style={{ fontFamily: "Poppins-Bold" }}>
                      Step 1/9
                    </Text>
                  </View>
                  <View className="mt-[44.4px] mb-[60px]  px-[32px]">
                    <View className="flex flex-col gap-[5px]">
                      <View className="flex flex-col gap-[5px]">
                        <Text className="text-[18px] " style={{ fontFamily: "Poppins-ExtraBold" }}>
                          Please enter store owner
                        </Text>
                      </View>
                      <View className="flex flex-col gap-[15px]">
                        <Text className="  text-[14px]  " style={{ fontFamily: "Poppins-Regular" }}>
                          Mobile Number
                        </Text>
                        <View className="flex flex-row items-center gap-[10px] px-[8px] bg-[#F9F9F9] py-[11px] border-[1px] border-[#c9c8c7] border-opacity-10 rounded-[16px] ">
                          <View className="text-[16px] font-extrabold border-r-[1px] border-[#b6b5b4] flex flex-row gap-[9px] pr-[9px] items-center">
                            <Text className="text-[16px]" style={{ fontFamily: "Poppins-ExtraBold" }}>
                              +91
                            </Text>
                            <Entypo
                              name="chevron-down"
                              size={16}
                              color="black"
                              className=""
                            />
                          </View>
                          <TextInput
                            value={mobileNumber}
                            placeholder="Ex : 9088-79-0488"
                            placeholderTextColor={"#dbcdbb"}
                            keyboardType="numeric"
                            onChangeText={handleMobileNo}
                            maxLength={10}
                            className="w-full text-[16px]  text-black "
                            style={{ fontFamily: "Poppins-Regular" }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>


          <TouchableOpacity
            disabled={mobileNumber.length !== 10}
            onPress={sendVerification}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 68,
              width: "100%",
              backgroundColor:
                mobileNumber.length !== 10 ? "#e6e6e6" : "#FB8C00",
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
                  fontFamily: "Poppins-Black",
                  color: mobileNumber.length !== 10 ? "#888888" : "white",
                }}
              >
                NEXT
              </Text>)}
          </TouchableOpacity>

          {loading && (
            <View style={{ ...styles.loadingContainer }}>
              <ActivityIndicator size="large" color="#fb8c00" />
            </View>
          )}
        </View>
      )}
      {!mobileScreen && (
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <KeyboardAvoidingView behavior="padding">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => setMobileScreen(true)}
                  style={{ padding: 14, position: "absolute", top: 40, left: 8, zIndex: 50 }}
                >
                  <BackArrow width={18} height={14} />
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <MobileNumberImg
                    // height={400}
                    width={width}
                    className="object-cover"
                  />
                  <Text className="text-[14.5px]  text-[#FB8C00]" style={{ fontFamily: "Poppins-Bold" }}>
                    Step 2/9
                  </Text>
                </View>

                <View style={{ paddingHorizontal: 32 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Poppins-ExtraBold",
                      color: "#001b33",
                      marginTop: 16,
                    }}
                  >
                    ENTER OTP
                  </Text>
                  <Text style={{ fontSize: 14, color: "#2e2c43", fontFamily: "Poppins-Regular" }}>
                    OTP should be auto-filled otherwise type it manually.Sending
                    OTP at{" "}
                    <Text className="text-[#558B2F] " style={{ fontFamily: "Poppins-SemiBold" }}>
                      +91 {mobileNumber}
                    </Text>
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      marginTop: 19,
                    }}
                  >
                    <TextInput
                      placeholder="* * * * * *"
                      maxLength={6}
                      placeholderTextColor={"#dbcdbb"}
                      keyboardType="numeric"
                      onChangeText={handleOtp}
                      value={otp}
                      style={{
                        letterSpacing: 8,
                        textAlignVertical: "center",
                        borderWidth: 1,
                        borderColor: "#c9c8c7",
                        backgroundColor: "#f9f9f9",
                        borderRadius: 16,
                        width: "100%",
                        height: 53,
                        textAlign: "center",
                        fontSize: 17,
                        fontFamily: "Poppins-Medium"
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: "column", marginTop: 15, paddingBottom: 80 }}>
                    <Text style={{ fontSize: 16, color: "#2e2c43", fontFamily: "Poppins-Medium" }}>
                      Didn't receive it?
                    </Text>
                    <TouchableOpacity onPress={sendVerification}>
                      {loading ? (
                        <ActivityIndicator size="small" color="#e76043" />
                      ) : (
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Poppins-ExtraBold',
                            color: "#e76043",
                          }}
                        >
                          RESEND
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <TouchableOpacity
            disabled={otp.length !== 6}
            onPress={checkMobileNumber}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 68,
              width: "100%",
              backgroundColor:
                otp.length !== 6 ? "#e6e6e6" : "#FB8C00",
              justifyContent: "center", // Center content vertically
              alignItems: "center", // Center content horizontally
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Black',
                  color: otp.length !== 6 ? "#888888" : "white",
                }}
              >
                NEXT
              </Text>
            )}
          </TouchableOpacity>

          {/* {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fb8c00" />
            </View>
          )} */}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
export default MobileNumberEntryScreen;
