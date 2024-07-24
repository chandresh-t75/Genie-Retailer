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
import ModalImg from "../assets/acceptRequest.svg";
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
import { baseUrl } from "../screens/utils/constants";
import axiosInstance from "../screens/utils/axiosInstance";

const RequestAcceptModal = ({
  user,
  modalVisible,
  setModalVisible,
  setAcceptLocal,
  messages,
  setMessages,
  type
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
  const accessToken = useSelector(state => state.storeData.accessToken);
  // console.log("userDetails", userDetails,
  //   "request",requestInfo);

  const [loading, setLoading] = useState(false);
  // modalVisible=true

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
      const config = {
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${accessToken}`,
        }
       }
      if (requestInfo?.requestType === "new") {
        try {
          await axiosInstance.patch(
            `${baseUrl}/chat/product-available`,
            {
              id: requestInfo?._id,

            },config
          ).then(async (res) => {
            socket.emit('new retailer',res.data);
            updateUserDetails();
            const requests = newRequests.filter(
              (request) => request._id ===requestInfo._id
            );
            console.log("RequestType new response", res.data, res.data.users[0], res.data.users[1]);
            let tmp = { ...requests[0],requestType: "ongoing", updatedAt: new Date().toISOString(), users:[res.data.users[0], res.data.users[1]] };
            console.log("new requestInfo", tmp)

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
            const token = await axiosInstance.get(
              `${baseUrl}/user/unique-token?id=${requestInfo?.customerId?._id}`,config
            );
            console.log("notify token: " + token.data);
            if (token.data.length > 0) {
              const notification = {
                token: token.data,
                title: user?.storeName,
                requestInfo: {
                  requestId: requestInfo?._id,
                  userId: res.data?.users[1]._id
                },
                tag: user?._id,
                image: requestInfo?.requestId?.requestImages[0],
                redirect_to: "bargain",
              };
              NotificationRequestAccepted(notification);
            }
                // console.log("after accepting request",requestInfo);
            
          })
        } catch (error) {
          setLoading(false);
          console.error("Error updating requestType 'new':", error);
          return;
        }
      } else {
        try {
          const accept = await axiosInstance.patch(
            `${baseUrl}/chat/accept-bid`,
            {
              messageId: lastMessage?._id,
              userRequestId: requestInfo?.requestId?._id,
            },config
          );
          console.log("Accept response", accept.data?.message);

          if (accept.status === 200) {
            try {
              socket.emit("new message", accept.data?.message);
              let tmp = {
                ...requestInfo,
                requestType: "win", updatedAt: new Date().toISOString()
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
              const token = await axiosInstance.get(
                `${baseUrl}/user/unique-token?id=${requestInfo?.customerId._id}`,config
              );
              if (token.data.length > 0) {
                const notification = {
                  token: token.data,
                  title: user?.storeName,
                  requestInfo: {
                    requestId: requestInfo?._id,
                    userId: requestInfo?.users[1]._id
                  },
                 
                  tag: user?._id,
                  price: lastMessage?.bidPrice,
                  image: requestInfo?.requestId?.requestImages[0],
                };
                NotificationBidAccepted(notification);
              }
              const notification = {
                token: accept?.data?.uniqueTokens,
                title: user?.storeName,
                requestInfo: {
                  requestId: requestInfo?._id,
                  userId: requestInfo?.users[0]._id
                },
                details:requestInfo?.requestId?.requestDescription,
                tag: user?._id,
                price: lastMessage?.bidPrice,
                image: requestInfo?.requestId?.requestImages[0],
              };
              //  console.log("new notification",notification);
              setModalVisible(false);
              setTimeout(() => {
                BidAcceptedOtherRetailer(notification)
              }, 500)

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

    const config = {
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${accessToken}`,
      },
    
     }
    await axiosInstance.patch(
      `${baseUrl}/retailer/editretailer`,
      {
        _id: userDetails?._id,
        freeSpades: userDetails.freeSpades - 1,
      },config)
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
        <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl" style={{ paddingVertical: 50 }}>
          <ModalImg />
          <View className="mt-[20px]">
            <Text className="text-[15px]  text-center text-[#001B33]" style={{ fontFamily: "Poppins-Bold" }}>
              Are you sure?{" "}
            </Text>
            {type == "Request" &&
              <Text className="text-[14px]  text-center  pt-[8px] text-[#001B33]" style={{ fontFamily: "Poppins-Regular" }}>
                You are accepting the customer request
              </Text>
            }
            {type == "Offer" &&
              <Text className="text-[14px]  text-center  pt-[8px] text-[#001B33]" style={{ fontFamily: "Poppins-Regular" }}>
                You are accepting the customer offer
              </Text>
            }

          </View>

          <View className="w-full flex flex-row justify-between">
            <View className="flex-1 mt-[10px]">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text className="text-[16px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-Regular" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 mt-[10px]">
              <TouchableOpacity onPress={handleModal}>
                {loading ? (
                  <ActivityIndicator size="small" color="#FB8C00" />
                ) : (
                  <Text className="text-[16px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-Bold" }}>
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
