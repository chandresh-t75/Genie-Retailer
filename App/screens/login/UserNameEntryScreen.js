import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Pressable,
  ScrollView,
  BackHandler,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import StoreName from "../../assets/StoreName.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import {
  setStoreName,
  setStoreOwnerName,
} from "../../redux/reducers/storeDataSlice";
import StoreModal from "../../components/StoreModal";
import QuestionIcon from "../../assets/QuestionIcon.svg"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const UserNameEntryScreen = () => {
  const navigation = useNavigation();
  const [storeName, setStoreNameLocal] = useState("");
  const [storeOwnerName, setStoreOwnerNameLocal] = useState("");
  const dispatch = useDispatch();
  // const navigationState = useNavigationState(state => state);
  // const isUserNameScreen= true;
  const [modalVisible, setModalVisible] = useState(false);
  const navigationState = useNavigationState(state => state);
  const isUserNameScreen = navigationState.routes[navigationState.index].name === 'registerUsername';
  console.log("isUserNameScreen", isUserNameScreen)
  const [focusedInput, setFocusedInput] = useState(null);
  const { width } = Dimensions.get("window");


  useEffect(() => {
    const backAction = () => {
      if (isUserNameScreen) {

        BackHandler.exitApp();
        return true;
      }
      // } else {
      //   return false;
      // }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [isUserNameScreen]);

  const handleStoreName = (storeName) => {
    // Update the mobile number state
    setStoreNameLocal(storeName);
    // Log the mobile number value
    // console.log(storeName);
  };
  const handleStoreOwnerName = (storeOwnerName) => {
    // Update the mobile number state
    setStoreOwnerNameLocal(storeOwnerName);
    // Log the mobile number value
    // console.log(storeOwnerName);
  };

  const storeDetails = () => {
    try {
      // const authData = JSON.parse(await AsyncStorage.getItem("authData"));
      // console.log(authData);

      dispatch(setStoreName(storeName));
      dispatch(setStoreOwnerName(storeOwnerName));
      navigation.navigate("searchCategory");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (

    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
          behavior="position"
        >


          <View className="flex-col justify-center pb-[100px]">
            <View className="w-full absolute z-40 top-[20px] flex flex-row justify-end items-center px-[32px]">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                className="flex flex-row p-4 items-center gap-2"
              >
                <QuestionIcon />
              </TouchableOpacity>
            </View>
            <View className="flex flex-col justify-center items-center gap-[0px]">
              <StoreName width={width} className="object-cover" />
              <Text className="text-[14.5px] text-[#FB8C00]" style={{ fontFamily: "Poppins-Bold" }}>Step 3/6</Text>
            </View>

            <View className="mt-[10px] flex flex-col gap-[15px] px-[32px] ">
              <View>
                <Text className="text-[16px] text-[#2e2c43] " style={{ fontFamily: "Poppins-ExtraBold" }}>Please enter your</Text>
                <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Store Name</Text>
                <View className="flex items-center">
                  <TextInput
                    onChangeText={handleStoreName}
                    placeholder="Ex: Kishor Kumar"
                    className="w-[310px] h-[54px] bg-gray-200 stroke-[#2e2c43] rounded-3xl px-10 mt-[5px]"
                    style={{ fontFamily: "Poppins-Regular" }}

                  />
                </View>
              </View>

              <View>
                <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Store Owner Name</Text>
                <View className="flex items-center">
                  <TextInput
                    onChangeText={handleStoreOwnerName}
                    placeholder="Ex: Kishor Kumar"
                    className="w-[310px] h-[54px] bg-gray-200 stroke-[#2e2c43] rounded-3xl px-10 mt-[5px]"
                    style={{ fontFamily: "Poppins-Regular" }}

                  />
                </View>
              </View>

            </View>


          </View>


        </KeyboardAvoidingView>
        <TouchableOpacity
          disabled={!storeName || !storeOwnerName}
          onPress={storeDetails}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 68,
            width: "100%",
            backgroundColor: (!storeName || !storeOwnerName) ? "#e6e6e6" : "#FB8C00",
            justifyContent: "center", // Center content vertically
            alignItems: "center", // Center content horizontally
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins-Black",
              color: (!storeName || !storeOwnerName) ? "#888888" : "white",
            }}
          >
            Next
          </Text>
        </TouchableOpacity>


      </ScrollView>


      {modalVisible && (
        <>
          <StoreModal
            modalConfirmVisible={modalVisible}
            setModalConfirmVisible={setModalVisible}
          />
          <View style={styles.overlay} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent greyish background
  },

})

export default UserNameEntryScreen;
