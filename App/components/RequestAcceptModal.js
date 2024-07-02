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
import ModalImg from "../assets/Cancel.svg";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  setNewRequests,
  setOngoingRequests,
  setRequestInfo,
} from "../redux/reducers/requestDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../screens/utils/socket.io/socket";
import {
  BidAcceptedOtherRetailer,
  NotificationBidAccepted,
  NotificationRequestAccepted,
} from "../notification/notificationMessages";
import { setUserDetails } from "../redux/reducers/storeDataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RequestAcceptModal = ({
  user,
  modalVisible,
  setModalVisible,
  setAcceptLocal,
  messages,
  setMessages,
}) => {
  // const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const messages = useSelector(state => state.requestData.messages);
  const requestInfo = useSelector((state) => state.requestData.requestInfo);
  const newRequests = useSelector(
    (state) => state.requestData.newRequests || []
  );
  const ongoingRequests = useSelector(
    (state) => state.requestData.ongoingRequests || []
  );

  const userDetails = useSelector(state => state.storeData.userDetails);

  const [loading, setLoading] = useState(false);

  // console.log("messages of ",messages)
  const handleModal = async () => {
    setLoading(true);
    try {
      const lastMessage = messages[messages.length - 1];
      // console.log("last message",lastMessage);
      if (!lastMessage) {
        console.log("No messages available to update.");
        return;
      }

      // console.log("Updating card", requestInfo);

      if (requestInfo?.requestType === "new") {
        try {
          await axios.patch(
            "http://173.212.193.109:5000/chat/modify-spade-retailer",
            {
              id: requestInfo?._id,
              type: "ongoing",
            }
          ).then(async (res) => {

            updateUserDetails();

            console.log("RequestType new response", res.data);
            let tmp = { ...requestInfo, requestType: "ongoing", updatedAt: new Date().toISOString() };

            dispatch(setRequestInfo(tmp));
            const filteredRequests = newRequests.filter(
              (request) => request._id !== requestInfo?._id
            );
            dispatch(setNewRequests(filteredRequests));
            const updatedOngoing = [tmp, ...ongoingRequests];
            dispatch(setOngoingRequests(updatedOngoing));

            setAcceptLocal(true);
            setModalVisible(false);
            setLoading(false);
            const token = await axios.get(
              `http://173.212.193.109:5000/user/unique-token?id=${requestInfo?.customerId._id}`
            );
            console.log("notify token: " + token.data);
            if (token.data.length > 0) {
              const notification = {
                token: token.data,
                title: user?.storeName,
                requestInfo: requestInfo,
                tag: user?._id,
                image: requestInfo?.requestId?.requestImages[0],
                redirect_to: "bargain",
              };
              //  console.log("new notification",notification);
              NotificationRequestAccepted(notification);
            }
          })
        } catch (error) {
          setLoading(false);
          console.error("Error updating requestType 'new':", error);
          return;
        }
      } else {
        try {
          const accept = await axios.patch(
            `http://173.212.193.109:5000/chat/accept-bid`,
            {
              messageId: lastMessage?._id,
              userRequestId: requestInfo?.requestId?._id,
            }
          );
          console.log("Accept response", accept.data?.message);

          if (accept.status === 200) {
            try {
              socket.emit("new message", accept.data?.message);
              let tmp = {
                ...requestInfo,
                requestType: "completed", updatedAt: new Date().toISOString()
              };
              dispatch(setRequestInfo(tmp));
              const updatedMessages = messages.map((message) => {
                if (message?._id === lastMessage?._id) {
                  return { ...message, bidAccepted: "accepted" };
                }
                return message;
              });
              setAcceptLocal(true);
              setMessages(updatedMessages);
              setLoading(false);
              const notification = {
                token: accept?.data?.uniqueTokens,
                title: user?.storeName,
                requestInfo: requestInfo,
                tag: user?._id,
                price: lastMessage?.bidPrice,
                image: requestInfo?.requestId?.requestImages[0],
              };
              //  console.log("new notification",notification);
              setModalVisible(false);
              NotificationBidAccepted(notification);
              BidAcceptedOtherRetailer(notification);
            } catch (error) {
              console.error("Error updating chat details:", error);
            }
          } else {
            console.error("Error updating message");
          }
        } catch (error) {
          setLoading(false);
          console.error("Error accepting bid:", error);
        }
      }
    } catch (error) {
      console.error("Error handling modal:", error);
    }
  };




  // Decreasing the count of available spades of retailer //////////////////////////////////////////////////////
  const updateUserDetails = async () => {


    await axios.patch(
      `http://173.212.193.109:5000/retailer/editretailer`,
      {
        _id: userDetails?._id,
        freeSpades: userDetails.freeSpades - 1,
      })
      .then(async (res) => {
        console.log("userData updated Successfully after payment ");
        dispatch(setUserDetails(res.data));
        console.log("res after user update", res.data);
        await AsyncStorage.setItem("userData", JSON.stringify(res.data));

      })
      .catch((err) => {
        console.error("error while updating profile", err.message);
      });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            <Text className="text-[15px]  text-center" style={{ fontFamily: "Poppins-Bold" }}>
              Are you sure?{" "}
            </Text>
            <Text className="text-[14px]  text-center  pt-[8px]" style={{ fontFamily: "Poppins-Regular" }}>
              You are accepting{" "}
            </Text>
          </View>

          <View className="w-full flex flex-row  justify-center">
            <View className="flex-1 mt-[5px]">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-Regular" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 mt-[5px]">
              <TouchableOpacity onPress={handleModal}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FB8C00" />
                ) : (
                  <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-SemiBold" }}>
                    Accept
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

export default RequestAcceptModal;
