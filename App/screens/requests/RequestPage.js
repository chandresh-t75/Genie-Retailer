import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ThreeDots from "../../assets/ThreeDotIcon.svg";
import { FontAwesome, Entypo } from "@expo/vector-icons";

import Copy from "../../assets/Copy.svg";
import Document from "../../assets/Document1.svg";
import Send from "../../assets/Send.svg";
import {
  useIsFocused,
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Profile from "../../assets/ProfileIcon2.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import RetailerBidMessage from "../../components/RetailerBidMessage";
import UserBidMessage from "../../components/UserBidMessage";
import UserMessage from "../../components/UserMessage";
import RetailerMessage from "../../components/RetailerMessage";

import RequestAcceptModal from "../../components/RequestAcceptModal";
import UserAttachment from "../../components/UserAttachment";
import RequestCancelModal from "../../components/RequestCancelModal";
import { socket } from "../utils/socket.io/socket";
import Attachment from "../../components/Attachment";
import {
  setOngoingRequests,
  setRequestInfo,
  setRetailerHistory,
} from "../../redux/reducers/requestDataSlice";
import { NotificationBidRejected } from "../../notification/notificationMessages";
import MessageLoaderSkeleton from "../utils/MessageLoaderSkeleton";
import BackArrow from "../../assets/arrow-left.svg";
import * as Clipboard from 'expo-clipboard';


// import Clipboard from '@react-native-clipboard/clipboard';

// import MessageLoaderSkeleton from "../utils/MessageLoaderSkeleton";
// import { setMessages } from "../../redux/reducers/requestDataSlice";


const RequestPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const scrollViewRef = useRef(null);

  // const [requestInfo, setRequestInfo] = useState();
  const [user, setUser] = useState();
  const [messages, setMessages] = useState([]);
  const [accept, setAcceptLocal] = useState(false);
  const [available, setAvailable] = useState(false);
  const [copied, setCopied] = useState(false);


  const [modal, setModal] = useState(false);
  const [closeRequestModal, setCloseRequestModal] = useState(false);
  const [acceptRequestModal, setAcceptRequestModal] = useState(false);
  const [cancelRequestModal, setCancelRequestModal] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [attachmentScreen, setAttachmentScreen] = useState(false);
  const [cameraScreen, setCameraScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedback, setFeedback] = useState("");

  const [rating, setRating] = useState(0);
  const { req } = route.params;
  const retailerHistory = useSelector(
    (state) => state.requestData.retailerHistory || []
  );
  const ongoingRequests = useSelector(
    (state) => state.requestData.ongoingRequests || []
  );

  const requestInfo = useSelector(
    (state) => state.requestData.requestInfo || {}
  );
  const isHome = useSelector(
    (state) => state.requestData.isHome
  );
  console.log("params", isHome);


  //    const navigationState = useNavigationState(state => state);
  // const isChat = navigationState.routes[navigationState.index].name === 'requestPage';
  // console.log("params",isHome,isChat);


  const fetchRequestData = useCallback(async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      setUser(userData);
      console.log("User data found successfully");

      // console.log("requestInfo page", requestInfo);

      // if (route?.params?.data) {
      // const  req =route?.params?.data
      console.log('reqInfo from notification section', req);
      // }
      // let response =

      await axios.get(
        `http://173.212.193.109:5000/chat/get-particular-chat`, {
        params: {
          retailerId: userData?._id,
          requestId: req?.requestId
        }
      }
      ).then(async (result) => {
        console.log("new requestInfo fetched successfully", result?.data[0]);
        dispatch(setRequestInfo(result?.data[0]))


        await axios
          .get("http://173.212.193.109:5000/chat/get-spade-messages", {
            params: {
              id: result?.data[0]?._id
            },
          })
          .then(async (response) => {
            setMessages(response?.data);

            // console.log("Messages found successfully",response.data);
            // console.log("user joined chat with chatId", response.data[0].chat._id);
            socket.emit("join chat", response?.data[0]?.chat?._id);

            console.log("socket join chat setup successfully");

            setLoading(false);
            if (
              result?.data[0]?.unreadCount > 0 &&
              result?.data[0]?.latestMessage?.sender?.type === "UserRequest"
            ) {
              const res = await axios.patch(
                "http://173.212.193.109:5000/chat/mark-as-read",
                {
                  id: result?.data[0]?._id,
                }
              );

              let tmp = { ...result?.data[0], unreadCount: 0 };

              dispatch(setRequestInfo(tmp));
              const filteredRequests = ongoingRequests.filter(
                (request) => request._id !== result?.data[0]?._id
              );
              if (requestInfo?.latestMessage?.bidType === "update") {
                console.log("update");
                const data = [...filteredRequests];
                dispatch(setOngoingRequests(data));
                const data2 = [tmp, ...retailerHistory];
                dispatch(setRetailerHistory(data2));
              } else {
                const data = [tmp, ...filteredRequests];
                dispatch(setOngoingRequests(data));
              }

              console.log("mark as read", res?.data, res?.data?.unreadCount);
            }
          })

      })
      // dispatch(setMessages(response.data));

      // socket.emit("join chat", response?.data[0].chat._id);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  const SocketSetUp = async (id) => {
    socket.emit("setup", id);
    console.log("socket setup for personal user setup successfully");
    // console.log("user connected with userId", requestInfo.users[0]._id);

    socket.on("connected", () => {
      setSocketConnected(true);
    });
  };

  useEffect(() => {
    console.log('route.params.data', req);
    // if (requestInfo) {
    //   console.log("find error of requestPage from home screen");
    //   SocketSetUp(requestInfo?.users[0]._id);
    // }
    if (req) {
      console.log("Params data found");
      // let req = route?.params?.data;
      // console.log('reqInfo from notification section',req);

      // dispatch(setRequestInfo(req));
      SocketSetUp(req?.userId);

      // setTimeout(()=>{
      //   console.log('reqInfo from params',requestInfo);
      // },2000);

    }
    fetchRequestData();

    return () => {
      if (socket) {
        // socket.disconnect();
        socket.emit("leave room", requestInfo?.users[0]?._id);
      }
    };
  }, []);



  const RejectBid = async () => {
    setisLoading(true);
    try {
      const lastMessage = messages[messages.length - 1]; // Get the last message
      if (!lastMessage) {
        console.log("No messages available to update.");
        return;
      }
      try {
        const response = await axios.patch(
          "http://173.212.193.109:5000/chat/reject-bid",
          {
            messageId: lastMessage?._id,
          }
        );

        // console.log("res", response);

        socket.emit("new message", response.data);
        const updatedMessages = messages.map((message) => {
          if (message?._id === lastMessage?._id) {
            return { ...message, bidAccepted: "rejected" };
          }
          return message;
        });

        // dispatch(setMessages(updatedMessages));
        setMessages(updatedMessages);
        const filteredRequests = ongoingRequests.filter(
          (request) => request._id !== requestInfo._id
        );
        const requests = ongoingRequests.filter(
          (request) => request._id === requestInfo._id
        );
        const updatedRequest = {
          ...requests[0],
          updatedAt: new Date().toISOString(),
        };
        //             // console.log("request ongoing",requests[0]?.updatedAt, new Date().toISOString());

        // console.log("request ongoing",filteredRequests.length,requests.length,updatedRequest)
        const data = [updatedRequest, ...filteredRequests];
        dispatch(setOngoingRequests(data));
        setisLoading(false);
        const token = await axios.get(
          `http://173.212.193.109:5000/user/unique-token?id=${requestInfo?.customerId._id}`
        );
        if (token.data.length > 0) {
          const notification = {
            token: token.data,
            title: user?.storeName,
            body: lastMessage.message,
            requestInfo: requestInfo,
            tag: user?._id,
            image: lastMessage?.bidImages[0],
            redirect_to: "bargain",
          };
          NotificationBidRejected(notification);
        }
      } catch (error) {
        setisLoading(false);

        console.log("Error updating chat:", error);
      }
      // } else {
      //   console.error("Error updating message.");
      // }
    } catch (error) {
      setisLoading(false);

      console.error("Error updating requesttype:", error);
    }
  };

  // New message recieved from socket code
  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      console.log("Message received from socket:", newMessageReceived);
      if (newMessageReceived?.bidType === "update") {
        let tmp = {
          ...requestInfo,
          requestType: "closed",
          updatedAt: new Date().toISOString(),
          unreadCount: 0,
        };
        console.log("update", tmp);
        dispatch(setRequestInfo(tmp));
        const filteredRequests = ongoingRequests.filter(
          (request) => request._id !== requestInfo?._id
        );
        dispatch(setOngoingRequests(filteredRequests));
        const newHistory = [tmp, ...retailerHistory];
        dispatch(setRetailerHistory(newHistory));
      }

      setMessages((prevMessages) => {
        if (
          prevMessages[prevMessages.length - 1]?.chat._id ===
          newMessageReceived?.chat._id
        ) {
          if (
            prevMessages[prevMessages.length - 1]?._id ===
            newMessageReceived?._id
          ) {
            if (newMessageReceived.bidAccepted === "accepted") {
              let tmp = {
                ...requestInfo,
                requestType: "completed",
                updatedAt: new Date().toISOString(),
                unreadCount: 0,
                //  requestId:{requestActive:"completed"}
              };
              console.log("request updated", tmp);
              dispatch(setRequestInfo(tmp));
              const filteredRequests = ongoingRequests.filter(
                (request) => request._id !== requestInfo?._id
              );

              //             // console.log("request ongoing",requests[0]?.updatedAt, new Date().toISOString());

              // console.log("request ongoing",filteredRequests.length,requests.length,updatedRequest)
              const data = [tmp, ...filteredRequests];
              dispatch(setOngoingRequests(data));
            }

            return prevMessages.map((message) =>
              message._id === newMessageReceived._id
                ? newMessageReceived
                : message
            );
          } else {
            // Add the new message to the list

            return [...prevMessages, newMessageReceived];
          }
        }

        // If the chat ID does not match, return the previous messages unchanged
        return prevMessages;
      });

      // let mess = [...messages];
      // if(mess[mess.length-1]?.chat?._id===newMessageReceived?.chat?._id){
      //   if(mess[mess.length-1]?._id===newMessageReceived?._id){
      //     mess[mess.length-1]=newMessageReceived;
      //   }
      //   else{
      //     mess.push(newMessageReceived);
      //   }
      // }
      // // dispatch(setMessages(mess));
      // setMessages(mess);
    };

    // dispatch(setMessages(handleMessageReceived));

    socket.on("message received", handleMessageReceived);
    console.log("Listening for 'message received' events");

    // Cleanup the effect
    return () => {
      socket.off("message received", handleMessageReceived);
      console.log("Stopped listening for 'message received' events");
    };
  }, []);

  // const messages = useSelector(state => state.requestData.messages);


  const handlePress = (star) => {
    setRating(star);
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

  useEffect(() => {
    const backAction = () => {
      if (isHome) {
        navigation.navigate("home");
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [isHome]);







  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {attachmentScreen && (
        <View style={styles.overlay}>
          <Attachment
            setAttachmentScreen={setAttachmentScreen}
            setCameraScreen={setCameraScreen}
            user={user}
            // requestInfo={requestInfo}
            messages={messages}
            setMessages={setMessages}
          />
        </View>
      )}
      <View className="relative">
        <View className=" relative bg-[#FFE7C8] pt-[40px] w-full flex flex-row px-[32px] justify-between items-center py-[30px]">
          <TouchableOpacity
            onPress={() => {
              if (isHome) {
                navigation.navigate("home");
              }
              else {

              }
            }}
            style={{ padding: 6 }}
          >
            <BackArrow width={14} height={10} />
          </TouchableOpacity>

          <View className="gap-[9px]">
            <View className="flex-row gap-[18px]">
              <View className=" flex items-center justify-center rounded-full ml-4 bg-white p-[4px]">
                {requestInfo?.customerId?.pic ? (
                  <Image
                    source={{ uri: requestInfo?.customerId?.pic }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      objectFit: "cover",
                    }}
                  // className="w-[40px] h-[40px] rounded-full"
                  />
                ) : (
                  <Profile className="w-full h-full rounded-full" />
                )}
              </View>
              <View className="w-[60%]">
                <Text
                  className="text-[14px]  text-[#2e2c43] capitalize"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {requestInfo?.customerId?.userName}
                </Text>
                <Text
                  className="text-[12px] text-[#79B649]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Online
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setModal(!modal);
            }}
          >
            <View className="px-[20px] py-[10px] ">
              <ThreeDots />
            </View>
          </TouchableOpacity>
        </View>
        {modal && (
          <View className="absolute top-[40px] right-[80px]  bg-white rounded-md">
            <TouchableOpacity
              onPress={() => {
                setModal(!modal);
                navigation.navigate("viewrequest");
              }}
            >
              <Text
                className="mx-5  py-3"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                View Request
              </Text>
            </TouchableOpacity>
            {/* <Pressable
              onPress={() => {
                setCloseRequestModal(true);
                setModal(!modal);
              }}
            >
              <Text className="mx-5 py-3">Close Request</Text>
            </Pressable> */}
          </View>
        )}

        <View className="px-[40px] pb-[20px] flex bg-[#ffe7c8]">
          <View className="flex-row gap-[10px] relative items-center">
            <Text
              className="text-[16px] "
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Request Id
            </Text>
            <Text style={{ fontFamily: "Poppins-Regular" }}>
              {requestInfo?.requestId?._id}
            </Text>
            <TouchableOpacity onPress={() => { copyToClipboard() }} style={{ padding: 4 }}>
              <Copy />
            </TouchableOpacity>
            {copied && <Text className="bg-[#ebebeb] p-2 rounded-lg absolute -top-10 right-0">Copied!</Text>}
          </View>
          <Text style={{ fontFamily: "Poppins-Regular" }}>
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

        {/*  message are mapped here */}

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
          style={{ marginBottom: 120 }}
        >
          {loading && (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, alignSelf: "flex-start" }}>
                <MessageLoaderSkeleton />
              </View>
              <View style={{ flex: 1, alignSelf: "flex-end" }}>
                <MessageLoaderSkeleton />
              </View>
            </View>
          )}

          {!loading && (
            <View className="flex gap-[21px] px-[10px] pt-[40px] pb-[100px]">
              {/* <ChatMessage
              bidDetails={messages[0]}
             
            /> */}
              {messages &&
                messages?.map((message) => {
                  // console.log("mapping", message); // You can move console.log outside of the return statement if you want to log the value
                  if (message?.bidType === "update") {
                    return (
                      <View key={message?._id} className="flex gap-6" >
                        <View className="flex justify-center bg-[#FFE7C8] rounded-[24px] px-[32px] py-[10px] ">
                          <Text
                            className="text-[16px] text-center text-[#FB8C00]"
                            style={{ fontFamily: "Poppins-Regular" }}
                          >
                            {message?.message}
                          </Text>
                        </View>
                        <View className="px-[32px] py-[10px] bg-[#ffe7c8] rounded-[24px] ">
                          <View className=" mt-[19px] ">
                            <Text
                              className="text-[14px]"
                              style={{ fontFamily: "Poppins-Bold" }}
                            >
                              Rate your experience with customer
                            </Text>
                            <View className="flex-row gap-[5px] mt-[10px]">
                              {[...Array(5)].map((_, index) => {
                                const star = index + 1;
                                return (
                                  <TouchableOpacity
                                    key={star}
                                    onPress={() => handlePress(star)}
                                  >
                                    <FontAwesome
                                      name={star <= rating ? "star" : "star-o"}
                                      size={32}
                                      color="#fb8c00"
                                      className="mx-[5px]"
                                    />
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          </View>

                          <View className="mb-[20px]">
                            <Text
                              className="text-[14px] text-[#2e2c43] mx-[6px] mt-[30px] mb-[15px]"
                              style={{ fontFamily: "Poppins-ExtraBold" }}
                            >
                              Feedback for customer
                            </Text>

                            <KeyboardAvoidingView className="h-[100px] bg-[#f9f9f9] rounded-xl ">
                              <TextInput
                                multiline
                                numberOfLines={4}
                                onChangeText={(val) => {
                                  setFeedback(val);
                                }}
                                value={feedback}
                                placeholder="Type here..."
                                placeholderTextColor="#dbcdbb"
                                className="w-full h-[100px] overflow-y-scroll px-[20px] border-[0.3px] border-[#2e2c43] rounded-xl "
                                style={{
                                  padding: 20,
                                  height: 300,
                                  flex: 1,
                                  textAlignVertical: "top",
                                  fontFamily: "Poppins-Regular",
                                }}
                              />
                            </KeyboardAvoidingView>
                          </View>
                          <TouchableOpacity
                            disabled={!rating || !feedback}
                            //  onPress={sendQuery}
                            style={{

                              height: 50,
                              width: "100%",
                              backgroundColor:
                                (!rating || !feedback) ? "#e6e6e6" : "#FB8C00",
                              justifyContent: "center", // Center content vertically
                              alignItems: "center", // Center content horizontally
                            }}
                          >
                            {feedbackLoading ? (
                              <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontFamily: "Poppins-Black",
                                  color:
                                    (!rating || !feedback) ? "#888888" : "white",
                                }}
                              >
                                Submit
                              </Text>
                            )}
                          </TouchableOpacity>

                        </View>


                      </View>
                    );
                  } else if (message?.sender?.refId !== user?._id) {
                    if (
                      message?.bidType === "true" ||
                      messages[0] === message
                    ) {
                      return (
                        <View
                          key={message?._id}
                          className="flex flex-row justify-start"
                        >
                          <UserBidMessage bidDetails={message} />
                        </View>
                      );
                    } else if (message?.bidType === "false") {
                      return (
                        <View
                          key={message?._id}
                          className="flex flex-row justify-start"
                        >
                          <UserMessage bidDetails={message} />
                        </View>
                      );
                    } else {
                      return (
                        <View
                          key={message?._id}
                          className="flex flex-row justify-start"
                        >
                          <UserAttachment bidDetails={message} />
                        </View>
                      );
                    }
                  } else {
                    if (message?.bidType === "true") {
                      return (
                        <View
                          key={message?._id}
                          className="flex flex-row justify-end"
                        >
                          <RetailerBidMessage
                            bidDetails={message}
                            user={user}
                          />
                        </View>
                      );
                    } else {
                      return (
                        <View
                          key={message?._id}
                          className="flex flex-row justify-end"
                        >
                          <RetailerMessage bidDetails={message} user={user} />
                        </View>
                      );
                    }
                  }
                })}
            </View>
          )}

          {/* Spacer View */}
        </ScrollView>
      </View>

      {/* Typing Area */}
      <View
        className={`absolute bottom-0 left-0 right-0 pt-[10] ${attachmentScreen ? "-z-50" : "z-50"
          } `}
      >
        {requestInfo?.requestType !== "closed" &&
          requestInfo?.requestType === "new" &&
          available === false && (
            <View className="gap-[20px] items-center bg-white pt-[20px] shadow-2xl">
              <View>
                <Text
                  className="text-[14px] text-center"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Are you accepting the customer request ?
                </Text>
                <Text
                  className="text-[14px] text-center px-[10px]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Please confirm the product/service availability by accepting
                  this request
                </Text>
              </View>

              <View className="w-full flex-row justify-between bg-white">
                <TouchableOpacity
                  onPress={() => { userDetails.freeSpades > 0 ? setAcceptRequestModal(true) : navigation.navigate('payment-gateway'); }}
                  style={{ flex: 1 }}
                >
                  <View className="h-[63px] flex items-center justify-center border-[1px] bg-[#FB8C00] border-[#FB8C00]">
                    <Text
                      className=" text-[16px] text-white "
                      style={{ fontFamily: "Poppins-Black" }}
                    >
                      Accept
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCancelRequestModal(true)}
                  style={{ flex: 1 }}
                >
                  <View className="h-[63px] flex items-center justify-center border-2 border-[#FB8C00] bg-white">
                    <Text
                      className=" text-[16px] text-[#FB8C00]"
                      style={{ fontFamily: "Poppins-Black" }}
                    >
                      Not Available
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

        {requestInfo?.requestType !== "closed" &&
          requestInfo?.requestType !== "cancelled" &&
          requestInfo?.requestType !== "new" &&
          ((requestInfo?.requestId?.requestActive === "completed" &&
            requestInfo?.requestId?.requestAcceptedChat === user?._id) ||
            (messages[messages.length - 1]?.bidType === "true" &&
              messages[messages.length - 1]?.bidAccepted === "accepted") ||
            (messages[messages.length - 1]?.bidType === "true" &&
              messages[messages.length - 1]?.bidAccepted === "rejected") ||
            messages[messages.length - 1]?.bidType === "false" ||
            messages[messages.length - 1]?.bidType === "image") && (
            <View
              className="flex flex-row bg-white items-center justify-center"
              style={{ padding: 10 }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("bidQuery", {
                    user,
                    // requestInfo: requestInfo,
                    messages,
                    setMessages,
                  })
                }
                style={{ backgroundColor: "white", flex: 1 }}
              >
                <View className="h-[63px] flex items-center justify-center bg-white border-[1px] border-[#FB8C00] rounded-3xl">
                  <Text
                    className="text-[16px] text-[#fb8c00] text-center"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    Send Message to Customer
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAttachmentScreen(true);
                }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View className="h-[63px] flex-row items-center justify-center bg-white border-[1px] border-[#FB8C00] rounded-3xl px-[4px]">
                  <Document />
                  <Text
                    className=" text-[16px] text-[#fb8c00] text-center"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    Send attachment
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        {requestInfo?.requestType !== "closed" &&
          requestInfo?.requestType !== "cancelled" &&
          requestInfo?.requestId?.requestActive === "active" &&
          messages &&
          messages.length > 0 &&
          messages[messages.length - 1]?.bidType === "true" &&
          messages[messages.length - 1]?.bidAccepted === "new" &&
          messages[messages.length - 1]?.sender?.refId !== user?._id && (
            <View className="gap-[20px] items-center bg-white pt-[20px] shadow-2xl">
              <View>
                <Text
                  className="text-[14px]  text-center"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Are you accepting the customer offer ?
                </Text>
                {/* <Text className="text-[14px] text-center" style={{ fontFamily: "Poppins-Regular" }}>
                  If you don’t understand the customer’s need,
                  {"\n"}select no and send query for clarification.
                </Text> */}
              </View>

              <View className="w-full flex-row justify-between">
                <TouchableOpacity
                  onPress={() => setAcceptRequestModal(true)}
                  style={{ flex: 1 }}
                >
                  <View className="h-[63px] flex items-center justify-center border-[1px] bg-[#FB8C00] border-[#FB8C00]">
                    <Text
                      className=" text-[16px] text-white"
                      style={{ fontFamily: "Poppins-Black" }}
                    >
                      Yes
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={RejectBid} style={{ flex: 1 }}>
                  <View className="h-[63px] flex items-center justify-center border-2 border-[#FB8C00] bg-white">
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FB8C00" />
                    ) : (
                      <Text
                        className=" text-[16px] text-[#FB8C00]"
                        style={{ fontFamily: "Poppins-Black" }}
                      >
                        No
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        {requestInfo?.requestType === "ongoing" &&
          requestInfo?.requestId?.requestActive === "active" &&
          messages &&
          messages.length > 0 &&
          ((messages[messages.length - 1]?.bidType === "true" &&
            messages[messages.length - 1]?.bidAccepted === "rejected") ||
            messages[messages.length - 1]?.bidType === "false" ||
            messages[messages.length - 1]?.bidType === "image") && (
            <View className="gap-[20px] bg-white pt-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("bidPageInput", {
                    user,
                    // requestInfo: requestInfo,
                    messages,
                    setMessages,
                  })
                }
              >
                <View className="h-[63px] flex items-center justify-center bg-[#FB8C00]">
                  <Text
                    className=" text-[16px] text-white"
                    style={{ fontFamily: "Poppins-Black" }}
                  >
                    Send an offer
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        {messages &&
          messages.length > 0 &&
          messages[messages.length - 1]?.bidType === "true" &&
          messages[messages.length - 1]?.bidAccepted === "new" &&
          messages[messages.length - 1]?.sender?.refId === user?._id && (
            <View className="flex items-center justify-center">
              <View className=" w-[90%] flex flex-row justify-center bg-[#FFE7C8] rounded-[24px]  py-[15px] mb-[10px] ">
                <Text
                  className="text-[16px] text-center text-[#FB8C00] "
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Waiting for customer response
                </Text>
              </View>
            </View>
          )}
      </View>
      <RequestCancelModal
        modalVisible={cancelRequestModal}
        setModalVisible={setCancelRequestModal}
      // requestInfo={requestInfo}
      />
      {/* <RequestCancelModal
        modalVisible={closeRequestModal}
        setModalVisible={setCloseRequestModal}
      /> */}
      <RequestAcceptModal
        user={user}
        modalVisible={acceptRequestModal}
        setModalVisible={setAcceptRequestModal}
        messages={messages}
        setMessages={setMessages}
        // requestInfo={requestInfo}
        setAcceptLocal={setAcceptLocal}
      />

      {/* {closeRequestModal && <View style={styles.overlay} />} */}
      {acceptRequestModal && <View style={styles.overlay} />}
      {cancelRequestModal && <View style={styles.overlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 100,
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    //  position:"absolute",
    //  bottom:0// Semi-transparent greyish background
  },
  // menuContainer: {
  //     flex: 1,
  //     // Add other styles for menu container
  // },
  attachments: {
    zIndex: 100, // Ensure the overlay is on top
  },
});

export default RequestPage;
