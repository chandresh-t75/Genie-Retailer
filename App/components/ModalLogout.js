import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ModalImg from "../assets/Logout.svg";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setUniqueToken,
  setUserDetails,
  storeClear,
} from "../redux/reducers/storeDataSlice";
import { bidClear } from "../redux/reducers/bidSlice";
import { requestClear } from "../redux/reducers/requestDataSlice";
import { baseUrl } from "../screens/utils/constants";
import axiosInstance from "../screens/utils/axiosInstance";



const ModalLogout = ({ user, modalVisible, setModalVisible }) => {
  // console.log("user at menu", user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector(state => state.storeData.accessToken);
  // const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation();
  const handleModal = async () => {
    setLoading(true);
    try {
      // Remove the item with key 'userData' from local storage

       await auth().signOut();

     const config = {
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${accessToken}`,
      }
     }
      const res = await axiosInstance.patch(
        `${baseUrl}/retailer/editretailer`,
        {
          _id: user?._id,
          uniqueToken: "",
        }, config
      );
      await messaging().deleteToken();
      console.log("FCM token deleted.");
      navigation.navigate("mobileNumber", { data: "" });
      dispatch(setUniqueToken(""));
      console.log("User data deleted successfully", res.data);
      //  setModalVisible(false);
      // await AsyncStorage.removeItem("userData");
      await AsyncStorage.clear();
      
      setLoading(false);
      setModalVisible(false);
      dispatch(bidClear());
      dispatch(requestClear());
      dispatch(storeClear());
    } catch (error) {
      setLoading(false);
      console.error("Error deleting user data:", error);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      // onRequestClose={() => {
      //   Alert.alert('Modal has been closed.');
      //   setModalVisible(!modalVisible);
      // }}
      className=" flex justify-center items-center  rounded-lg h-full" 
    >
      <View className="flex-1  justify-center items-center">
        <View className="bg-white w-[85%] px-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl  pt-[80px] pb-[40px]">
          <ModalImg classname="w-[117px] h-[75px]" />
          <View className="">
            <Text className="text-[15px] text-center text-[#001B33]" style={{ fontFamily: "Poppins-Bold" }}>
              Are you sure?{" "}
            </Text>
            <Text className="text-[14px]  text-center  pt-[8px] text-[#001B33]" style={{ fontFamily: "Poppins-Regular" }}>
              you are trying to logout{" "}
            </Text>
          </View>

          <View className="w-full flex flex-row  justify-center">
            <View className="flex-1 mt-[5px]">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text className="text-[14.5px] text-[#FB8C00] text-center" style={{ fontFamily: "Poppins-Regular" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 mt-[5px]">
              <TouchableOpacity onPress={handleModal}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FB8C00" />
                ) : (
                  <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-SemiBold" }}>
                    Logout
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // modalView: {
  //   margin: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
});

export default ModalLogout;
