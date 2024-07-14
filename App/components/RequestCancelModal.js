import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
} from "react-native";
import ModalImg from "../assets/Cancel.svg";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setNewRequests, setRequestInfo, setRetailerHistory } from "../redux/reducers/requestDataSlice";
import { ActivityIndicator } from "react-native-paper";

const RequestCancelModal = ({ modalVisible, setModalVisible }) => {
  // const [modalVisible, setModalVisible] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const requestInfo = useSelector((state) => state.requestData.requestInfo);
  const [loading,setLoading]=useState(false);
  const newRequests = useSelector(
    (state) => state.requestData.newRequests || []
  );
  const retailerHistory= useSelector(state => state.requestData.retailerHistory|| [])

  const handleModal = async () => {
    setLoading(true);
    try {
      // console.log("RequestType canecl response", requestInfo);
      const res = await axios.patch(
        "http://173.212.193.109:5000/chat/product-not-available",
        {
          id: requestInfo?._id,
       
        }
      );
      if (res.status === 200) {
        let tmp = { ...requestInfo, requestType: "rejected" };
        dispatch(setRequestInfo(tmp));
        const filteredRequests = newRequests.filter(
          (request) => request._id !== requestInfo?._id
        );
        dispatch(setNewRequests(filteredRequests));
        const updatedOngoing = [tmp, ...retailerHistory];
          dispatch(setRetailerHistory(updatedOngoing));
        // console.log("RequestType cancel response", res);
        setLoading(false);
        
        setModalVisible(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating requestType 'new':", error);
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
      className=" flex justify-center items-center  rounded-lg h-full "
    >
      <View className="flex-1  justify-center items-center">
        <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl">
          <ModalImg classname="w-[117px] h-[75px]" />
          <View className="">
            <Text
              className="text-[15px]  text-center text-[#001B33]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Are you sure?{" "}
            </Text>
            <Text
              className="text-[14px] text-center  pt-[8px] text-[#001B33]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              You are rejecting the user request{" "}
            </Text>
          </View>

          <View className="w-full flex flex-row  justify-center">
            <View className="flex-1 mt-[5px]">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text
                  className="text-[14.5px] text-[#FB8C00]  text-center"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 mt-[5px]">
              <TouchableOpacity onPress={handleModal}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FB8C00" />
                ) : (
                  <Text
                    className="text-[14.5px] text-[#FB8C00]  text-center"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    Yes
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

export default RequestCancelModal;
