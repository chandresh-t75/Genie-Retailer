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
  Animated,
  Modal,
  AppState,
} from "react-native";
import React, {
  memo,
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
  setNewRequests,
  setOngoingRequests,
  setOnlineUser,
  setRequestInfo,
  setRetailerHistory,
} from "../../redux/reducers/requestDataSlice";
import { NotificationBidRejected } from "../../notification/notificationMessages";
import MessageLoaderSkeleton from "../utils/MessageLoaderSkeleton";
import BackArrow from "../../assets/BackArrow.svg";
import * as Clipboard from "expo-clipboard";
import navigationService from "../../navigation/navigationService";
import ConfirmPaymentModal from "../../components/ConfirmPaymentModal";
import UploadGSTModal from "../../components/UploadGSTModal";
import { daysDifference } from "../utils/lib";
import { setUserDetails } from "../../redux/reducers/storeDataSlice";
import { Dimensions } from "react-native";
import LocationMessage from "../../components/LocationMessage";
import SendDocument from "../../components/SendDocument";
import UserDocumentMessage from "../../components/userDocumentMessage";
import RetailerDocumentMessage from "../../components/RetailerDocumentMessage";
import { baseUrl } from "../utils/constants";
import DropDown from "../../assets/dropDown.svg";
import DropDownUp from "../../assets/dropDownUp.svg";
import ErrorModal from "../../components/ErrorModal";
import axiosInstance from "../utils/axiosInstance";
import NetworkError from "../../components/NetworkError";

// import Clipboard from '@react-native-clipboard/clipboard';

// import MessageLoaderSkeleton from "../utils/MessageLoaderSkeleton";
// import { setMessages } from "../../redux/reducers/requestDataSlice";

const RequestPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const scrollViewRef = useRef(null);
  const { width } = Dimensions.get("window");
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));

  // const [requestInfo, setRequestInfo] = useState();
  // const [user, setUser] = useState();
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
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [confirmPaymentModal, setConfirmPaymentModal] = useState(false);
  const [uploadGSTModal, setUploadGSTModal] = useState(false);
  const [type, setType] = useState("");
  const [requestOpen,setRequestOpen] = useState(false);

  const [rating, setRating] = useState(0);
  // const { req } = route.params;
  const retailerHistory = useSelector(
    (state) => state.requestData.retailerHistory || []
  );
  const ongoingRequests = useSelector(
    (state) => state.requestData.ongoingRequests || []
  );

  const requestInfo = useSelector(
    (state) => state.requestData.requestInfo || {}
  );
  const currentRequest = useSelector(
    (state) => state.requestData.currentRequest
  );
  const newRequests = useSelector(
    (state) => state.requestData.newRequests || []
  );
  const user = useSelector((state) => state.storeData.userDetails);
  const accessToken = useSelector((state) => state.storeData.accessToken);

  const [online, setOnline] = useState(false);
  const [viewHeight, setViewHeight] = useState(0);
  const [errorModal, setErrorModal] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
// ////////////////////////////////////Connecting socket from when app goes from backgroun to foreground/////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log(currentRequest)
        if(currentRequest?.userId && currentRequest?.senderId)
          SocketSetUp();
        else if(currentRequest?.userId && !currentRequest?.senderId){
          SocketSetUp();
        }
        else if(!currentRequest?.userId && !currentRequest?.senderId)
          navigation.navigate('home');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // console.log("params", currentRequest);

  //    const navigationState = useNavigationState(state => state);
  // const isChat = navigationState.routes[navigationState.index].name === 'requestPage';
  // console.log("params",isHome,isChat);
  const fetchUserDetails = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    // setUser(userData);
    dispatch(setUserDetails(userData));
  };

  const fetchRequestData = useCallback(async () => {
    setLoading(true);
    try {
      // const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      // setUser(userData);
      // console.log("User data found successfully", currentRequest);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          id: currentRequest?.requestId,
        },
      };
      await axiosInstance
        .get(`${baseUrl}/chat/get-particular-chat`, config)
        .then(async (resu) => {
          const result = resu?.data;
          // console.log("new requestInfo fetched successfully", result);
          dispatch(setRequestInfo(result));
          fetchMessages(result)
         
      })
    } catch (error) {
      // dispatch(setMessages(response.data));

      // socket.emit("join chat", response?.data[0].chat._id);
      setLoading(false);
      if (!error?.response?.status)
          setNetworkError(true);
    
      console.error("Error fetching messages:", error);
    }
  },[]);

  const fetchMessages=async(result)=>{
    const configg = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        id: result?._id,
      },
    };

    try{
      await axiosInstance
      .get(`${baseUrl}/chat/get-spade-messages`, configg)
      .then(async (response) => {
        // console.log("fetching messages", response.data);
        setMessages(response.data);
        // console.log("Messages found successfully", response.data);
        // console.log("user joined chat with chatId", response.data[0].chat._id);
        socket.emit("join chat", response?.data[0]?.chat?._id);

        console.log("socket join chat setup successfully");
        const lastMessage = response?.data[response?.data.length - 1];
        // console.log("last Mesage: ", lastMessage);

        if (
          result?.unreadCount > 0 &&
          result?.latestMessage?.sender?.type === "UserRequest"
        ) {
          const configh = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          };

          const res = await axiosInstance.patch(
            `${baseUrl}/chat/mark-as-read`,
            {
              id: result?._id,
            },
            configh
          );

          let tmp = {
            ...result,
            unreadCount: 0,
            updatedAt: new Date().toISOString(),
          };
          console.log("mar as read ");

          dispatch(setRequestInfo(tmp));
          const filteredRequests = ongoingRequests.filter(
            (request) => request._id !== result?._id
          );

          const data = [tmp, ...filteredRequests];
          dispatch(setOngoingRequests(data));

          console.log("mark as read", res?.data?.unreadCount);
        }
        if (
          result.requestType === "win" &&
          lastMessage &&
          lastMessage?.bidType === "update"
        ) {
          console.log("update");
          const configc = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          };
          await axiosInstance
            .patch(
              `${baseUrl}/chat/update-to-history`,
              {
                id: result?._id,
                type: "completed",
              },
              configc
            )
            .then((res) => {
              const filteredRequests = ongoingRequests.filter(
                (request) => request._id !== result?._id
              );

              let tmp = {
                ...result,
                unreadCount: 0,
                requestType: "completed",
           bidCompleted: true,
                updatedAt: new Date().toISOString(),
              };
              dispatch(setRequestInfo(tmp));
              const data = [...filteredRequests];
              dispatch(setOngoingRequests(data));
              const data2 = [tmp, ...retailerHistory];
              dispatch(setRetailerHistory(data2));
            });
        } else if (
          result.requestType === "closed" &&
          lastMessage &&
          lastMessage?.bidType === "update"
        ) {
          console.log("update");
          const configcl = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          };
          await axiosInstance
            .patch(
              `${baseUrl}/chat/update-to-history`,
              {
                id: result?._id,
                type: "closedHistory",
              },
              configcl
            )
            .then((res) => {
              const filteredRequests = ongoingRequests.filter(
                (request) => request._id !== result?._id
              );

              let tmp = {
                ...result,
                unreadCount: 0,
                requestType: "closedHistory",
      bidCompleted: true,
                updatedAt: new Date().toISOString(),
              };
              dispatch(setRequestInfo(tmp));
              const data = [...filteredRequests];
              dispatch(setOngoingRequests(data));
              const data2 = [tmp, ...retailerHistory];
              dispatch(setRetailerHistory(data2));
            });
        } else if (
          result.requestType === "new" &&
          lastMessage &&
          lastMessage?.bidType === "update"
        ) {
          console.log("update");
          const confign = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          };
          await axiosInstance
            .patch(
              `${baseUrl}/chat/update-to-history`,
              {
                id: result?._id,
                type: "notParticipated",
              },
              confign
            )
            .then((res) => {
              const filteredRequests = newRequests.filter(
                (request) => request._id !== result?._id
              );

              let tmp = {
                ...result,
                unreadCount: 0,
                requestType: "notParticipated",
      bidCompleted: true,
                updatedAt: new Date().toISOString(),
              };
              dispatch(setRequestInfo(tmp));
              const data = [...filteredRequests];
              dispatch(setNewRequests(data));
              const data2 = [tmp, ...retailerHistory];
              dispatch(setRetailerHistory(data2));
            });
        }

        setLoading(false);
      })
    }
  catch (error) {
    setLoading(false);
    console.log("hii")
    if (!error?.response?.status){
        setNetworkError(true);
    }
  
    console.error("Error fetching messages:", error);
  }
  }

  const  SocketSetUp = async () => {
    console.log("setup", currentRequest?.userId,currentRequest?.senderId);
    const userId=currentRequest?.userId
    const senderId=currentRequest?.senderId
    socket.emit("setup", { userId, senderId });
    console.log("socket setup for personal user setup successfully");
    // console.log("user connected with userId", requestInfo.users[0]._id);

    // socket.on("connected", () => {
    //   setSocketConnected(true);
    // });
  };

  // const memoizeFunctionCalls = useMemo(()=>{
    
  // },[])

  const networkRefresh=()=>{
    SocketSetUp();
    fetchRequestData();
  }

  useEffect(() => {
   
    // console.log("route.params.data", currentRequest);
    
    console.log("Params data found");

    fetchUserDetails();
    if(currentRequest?.userId && currentRequest?.senderId)
      SocketSetUp();
    else if(currentRequest?.userId && !currentRequest?.senderId){
      SocketSetUp();
    }
   
    fetchRequestData();
    console.log("reqInfo from params", socketConnected);
    return () => {
      if (socket) {
        // socket.disconnect();
        const userId = currentRequest?.userId;
        const senderId = currentRequest?.senderId;
        socket.emit("leave room", { userId, senderId });
      }
    };
  }, []);

  useEffect(() => {
    const handleUserOnline = () => {
      setOnline(true);
      dispatch(setOnlineUser(true));
    
      console.log("user online");
    };

    const handleUserOffline = () => {
      setOnline(false);
      dispatch(setOnlineUser(false));

      console.log("user offline");
    };

    const handleConnectUser = (value) => {
        if(value.value){
          setOnline(true);
          dispatch(setOnlineUser(true));
        }
        else{
          setOnline(false);
          dispatch(setOnlineUser(false));
        }
    };

    socket.on("online", handleUserOnline);
    socket.on("offline", handleUserOffline);
    socket.on("connected",handleConnectUser);

    return () => {
      socket.off("online", handleUserOnline);
      socket.off("offline", handleUserOffline);
      socket.off("connected", handleConnectUser);
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
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const response = await axiosInstance
          .patch(
            `${baseUrl}/chat/reject-bid`,
            {
              messageId: lastMessage?._id,
            },
            config
          )
          .then(async (response) => {
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

            const token = await axiosInstance.get(
              `${baseUrl}/user/unique-token?id=${requestInfo?.customerId._id}`,
              config
            );
            if (token.data.length > 0) {
              const notification = {
                token: token.data,
                title: user?.storeName,
                body: lastMessage.message,
                requestInfo: {
                  requestId: requestInfo?._id,
                  userId: requestInfo?.users[1]._id,
                  senderId: requestInfo?.users[0]._id,

                },
                tag: user?._id,
                image: lastMessage?.bidImages[0],
                redirect_to: "bargain",
              };
              NotificationBidRejected(notification);
            }
          });

        // console.log("res", response);
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
  const updateHistoryWin = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axiosInstance
        .patch(
          `${baseUrl}/chat/update-to-history`,
          {
            id: requestInfo?._id,
            type: "completed",
          },
          config
        )
        .then((res) => {
          console.log("accepted get complete d using socket");
          const filteredRequests = ongoingRequests.filter(
            (request) => request._id !== requestInfo?._id
          );

          let tmp = {
            ...requestInfo,
            requestType: "completed",
            bidCompleted: true,
            updatedAt: new Date().toISOString(),
            unreadCount: 0,
          };
          dispatch(setRequestInfo(tmp));

          const data = [...filteredRequests];
          dispatch(setOngoingRequests(data));
          const data2 = [tmp, ...retailerHistory];
          dispatch(setRetailerHistory(data2));
        });
    } catch (error) {
      console.log("error updating history win", error);
    }
  };

  const updateHistoryClosed = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axiosInstance
        .patch(
          `${baseUrl}/chat/update-to-history`,
          {
            id: requestInfo?._id,
            type: "closedHistory",
          },
          config
        )
        .then((res) => {
          console.log(
            "closed get closed  using socket",
            requestInfo?.requestType
          );

          const filteredRequests = ongoingRequests.filter(
            (request) => request?._id !== requestInfo?._id
          );
          let tmp = {
            ...requestInfo,
            requestType: "closedHistory",
            bidCompleted: true,
            updatedAt: new Date().toISOString(),
            unreadCount: 0,
          };
          dispatch(setRequestInfo(tmp));
          const data = [...filteredRequests];
          dispatch(setOngoingRequests(data));
          const data2 = [tmp, ...retailerHistory];
          dispatch(setRetailerHistory(data2));
        });
    } catch (error) {
      console.log("errror update to history closed ", error);
    }
  };

  const updateHistoryNew = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axiosInstance
        .patch(
          `${baseUrl}/chat/update-to-history`,
          {
            id: requestInfo?._id,
            type: "notParticipated",
          },
          config
        )
        .then((res) => {
          console.log("not particpated get complete d using socket");
          const filteredRequests = newRequests.filter(
            (request) => request._id !== requestInfo?._id
          );

          let tmp = {
            ...requestInfo,
            requestType: "notParticipated",
            bidCompleted: true,
            updatedAt: new Date().toISOString(),
            unreadCount: 0,
          };
          dispatch(setRequestInfo(tmp));

          const data = [...filteredRequests];
          dispatch(setNewRequests(data));
          const data2 = [tmp, ...retailerHistory];
          dispatch(setRetailerHistory(data2));
        });
    } catch (error) {
      console.log("error updating history new", error);
    }
  };

  useEffect(() => {
    const handleMessageReceived = async (newMessageReceived) => {
      console.log("Message received from socket:",newMessageReceived._id, newMessageReceived.message);  

      if (
        requestInfo?.requestType === "win" &&
        newMessageReceived?.bidType === "update"
      ) {
        updateHistoryWin();
      } else if (
        (requestInfo?.requestType === "closed" ||
          requestInfo?.requestType === "ongoing") &&
        newMessageReceived?.bidType === "update"
      ) {
        updateHistoryClosed();
      } else if (
        requestInfo?.requestType === "new" &&
        newMessageReceived?.bidType === "update"
      ) {
        updateHistoryNew();
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
                requestType: "win",
                updatedAt: new Date().toISOString(),
                unreadCount: 0,
                //  requestId:{requestActive:"completed"}
              };
              // console.log("request updated", tmp);
              dispatch(setRequestInfo(tmp));
              const filteredRequests = ongoingRequests.filter(
                (request) => request._id !== tmp?._id
              );

              //             // console.log("request ongoing",requests[0]?.updatedAt, new Date().toISOString());

              const data = [tmp, ...filteredRequests];
              dispatch(setOngoingRequests(data));
              // console.log("requestAccepted", requestInfo);
              // console.log("request ongoing",filteredRequests)
            }
            else if (newMessageReceived.bidAccepted === "rejected") {
             
              let tmp = {
                ...requestInfo,
                updatedAt: new Date().toISOString(),
                unreadCount: 0,
                //  requestId:{requestActive:"completed"}
              };
              // console.log("request updated", tmp);
              dispatch(setRequestInfo(tmp));
              const filteredRequests = ongoingRequests.filter(
                (request) => request._id !== tmp?._id
              );

              //             // console.log("request ongoing",requests[0]?.updatedAt, new Date().toISOString());

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
  }, [requestInfo]);
 
  const handlePress = (star) => {
    setRating(star);
    console.log("star", star);
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(requestInfo?.requestId?._id);
      console.log("Text copied to clipboard");
      setCopied(true);

      // Hide the notification after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text to clipboard", error);
    }
  };


  const handleImagePress = (image) => {
    setSelectedImage(image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }; 

  const handleClose = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     if (isHome) {
  //       navigation.navigate("home");
  //       return true;
  //     } else {
  //       BackHandler.exitApp();
  //       return true;
  //     }
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction
  //   );

  //   return () => backHandler.remove(); // Clean up the event listener
  // }, [isHome]);

  const SubmitFeedback = async () => {
    setisLoading(true);

    try {
      if (rating == 0) return;
      console.log(
        "feedback",
        requestInfo?.customerId?._id,
        user?._id,
        rating,
        feedback,
        user?.storeName,
        requestInfo?._id
      );
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axiosInstance
        .post(
          `${baseUrl}/rating/rating-feedback`,
          {
            user: { type: "User", refId: requestInfo?.customerId?._id },
            sender: { type: "Retailer", refId: user?._id },
            rating: rating,
            feedback: feedback,
            senderName: user?.storeName,
            chatId: requestInfo?._id,
          },
          config
        )
        .then((response) => {
          // console.log("response of feedback", response.data);
          let tmp = {
            ...requestInfo,
            rated: true,
            updatedAt: new Date().toISOString(),
          };
          console.log("update", tmp);
          dispatch(setRequestInfo(tmp));

          const filteredRequests = retailerHistory.filter(
            (request) => request._id !== requestInfo._id
          );
          const requests = retailerHistory.filter(
            (request) => request._id === requestInfo._id
          );
          const updatedRequest = {
            ...requests[0],
            updatedAt: new Date().toISOString(),
          };
          //             // console.log("request ongoing",requests[0]?.updatedAt, new Date().toISOString());

          // console.log("request ongoing",filteredRequests.length,requests.length,updatedRequest)
          const data = [updatedRequest, ...filteredRequests];
          dispatch(setRetailerHistory(data));
          setisLoading(false);
        });
    } catch (error) {
      // setisLoading(false);

      console.error("Error sending feedback:", error);
    }
  };

  const remainingDays =
    daysDifference(user?.createdAt) > 0
      ? 0
      : 60 - daysDifference(user?.createdAt);
  // console.log("remainingDays: ", remainingDays);

  // console.log("requestinfo checking", requestInfo);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height);
    // console.log("heightof section", height)
  };

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
            setErrorModal={setErrorModal}
          />
        </View>
      )}
      <View className="relative">
        <View onLayout={handleLayout}>
          <View className="relative bg-[#FFE7C8] pt-[20px] w-full flex flex-row  justify-between items-center py-[30px] pb-[10px]">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{ padding: 20, paddingRight: 5, zIndex: 30 }}
            >
              <BackArrow />
            </TouchableOpacity>

            <View className="gap-[9px] w-[70%]">
              <View className="flex-row gap-[18px] items-center">
                <View className=" flex items-center justify-center rounded-full ml-2  bg-white ">
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
                <View className="">
                  <Text
                    className="text-[14px]  text-[#2e2c43] capitalize"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    {requestInfo?.customerId?.userName?.substring(0, 20)}
                    {requestInfo?.customerId?.userName?.length > 20 && (
                      <Text>...</Text>
                    )}
                  </Text>
                  {online && (
                    <Text
                      className="text-[12px] text-[#79B649]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      Online
                    </Text>
                  )}
                  {!online && (
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

            <TouchableOpacity
              onPress={() => {
                setModal(!modal);
              }}
            >
              <View className="px-[20px] py-[10px] pr-[40px]">
                <ThreeDots />
              </View>
            </TouchableOpacity>
          </View>
          {modal && (
            <View className="absolute z-50 top-[16px] right-[80px]  bg-white rounded-md">
              <TouchableOpacity
                onPress={() => {
                  setModal(!modal);
                  navigation.navigate("viewrequest");
                }}
                style={{
                  padding: 14,
                  borderBottomColor: "rgba(0, 0, 0, 0.05)",
                  borderBottomWidth: 1,
                  marginHorizontal: 8,
                }}
              >
                <Text
                  className="mx-5 text-[#2e2c43]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  View Request
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModal(!modal);
                  const requestId = requestInfo?.requestId?._id;
                  navigation.navigate("customer-report", { requestId });
                }}
                style={{ padding: 14 }}
              >
                <Text
                  className="mx-5 text-[#2e2c43]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Report Customer
                </Text>
              </TouchableOpacity>
            </View>
          )}


          <View className="px-[50px] pb-[20px] flex bg-[#ffe7c8]">
            <View className="gap-[0px] relative ">
              <Text
                className="text-[14px]"
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
           
           
          </View>
        </View>

        {/*  message are mapped here */}

        {messages[messages?.length - 1]?.bidType === "true" &&
          messages[messages?.length - 1]?.bidAccepted === "new" &&
          messages[messages?.length - 1]?.sender?.type === "UserRequest" && (
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.3 )",
                height: 1000,
                width: width,
                position: "absolute",
                zIndex: 100,
                top: viewHeight,
              }}
            ></View>
          )}

        {requestInfo?.requestType !== "closed" &&
        requestInfo?.bidCompleted !==true &&
          requestInfo?.requestType === "new" &&
          available === false && (
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                height: 1000,
                width: width,
                position: "absolute",
                zIndex: 100,
                top: viewHeight,
              }}
            ></View>
          )}



{networkError && <View style={{ marginTop: 30 ,justifyContent:"center" ,alignItems:"center", zIndex: 120,}}><NetworkError callFunction={networkRefresh} setNetworkError={setNetworkError} /></View>}

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
          style={{ marginBottom: 140 }} 
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
            <View
              style={{
                flex: 1,
                gap: 20,
                paddingHorizontal: 10,
                paddingTop: 40,
                paddingBottom: 140,
              }}
            >
              {/* <ChatMessage bidDetails={messages[0]} /> */}
              {messages &&
                messages.map((message) => {
                  if (message?.bidType === "update") {
                    return (
                      <View key={message?._id} style={{ flex: 1, gap: 6 }}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            backgroundColor: "#FFE7C8",
                            borderRadius: 24,
                            paddingHorizontal: 32,
                            paddingVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              textAlign: "center",
                              color: "#FB8C00",
                              fontFamily: "Poppins-Regular",
                            }}
                          >
                            {message?.message}
                          </Text>
                        </View>
                        {!requestInfo?.rated &&
                          requestInfo?.requestType === "completed" && (
                            <View
                              style={{
                                paddingHorizontal: 32,
                                paddingVertical: 10,
                                backgroundColor: "#ffe7c8",
                                borderRadius: 24,
                              }}
                            >
                              <View style={{ marginTop: 19 }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontFamily: "Poppins-Regular",
                                  }}
                                >
                                  Rate your experience with customer
                                </Text>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    gap: 5,
                                    marginTop: 10,
                                  }}
                                >
                                  {[...Array(5)].map((_, index) => {
                                    const star = index + 1;
                                    return (
                                      <TouchableOpacity
                                        key={star}
                                        onPress={() => handlePress(star)}
                                      >
                                        <FontAwesome
                                          name={
                                            star <= rating ? "star" : "star-o"
                                          }
                                          size={32}
                                          color="#fb8c00"
                                          style={{ marginHorizontal: 5 }}
                                        />
                                      </TouchableOpacity>
                                    );
                                  })}
                                </View>
                              </View>

                              <View style={{ marginBottom: 20 }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    marginHorizontal: 6,
                                    marginTop: 30,
                                    marginBottom: 15,
                                    fontFamily: "Poppins-Regular",
                                  }}
                                >
                                  Feedback for customer
                                </Text>

                                <KeyboardAvoidingView
                                  style={{
                                    height: 100,
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: 10,
                                  }}
                                >
                                  <TextInput
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={(val) => {
                                      setFeedback(val);
                                    }}
                                    value={feedback}
                                    placeholder="Type here..."
                                    placeholderTextColor="#dbcdbb"
                                    style={{
                                      width: "100%",
                                      height: 100,
                                  
                                      paddingHorizontal: 20,
                                      borderWidth: 0.3,
                                      borderColor: "#2e2c43",
                                      borderRadius: 10,
                                      padding: 20,
                                      textAlignVertical: "top",
                                      fontFamily: "Poppins-Regular",
                                    }}
                                  />
                                </KeyboardAvoidingView>
                              </View>
                              <TouchableOpacity
                                disabled={!rating && !feedback}
                                onPress={() => {
                                  SubmitFeedback();
                                }}
                                style={{
                                  height: 50,
                                  width: "100%",
                                  backgroundColor:
                                    !rating && !feedback
                                      ? "#e6e6e6"
                                      : "#FB8C00",
                                  justifyContent: "center", // Center content vertically
                                  alignItems: "center", // Center content horizontally
                                }}
                              >
                                {feedbackLoading ? (
                                  <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                  />
                                ) : (
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      fontFamily: "Poppins-Black",
                                      color:
                                        !rating && !feedback
                                          ? "#888888"
                                          : "white",
                                    }}
                                  >
                                    Submit
                                  </Text>
                                )}
                              </TouchableOpacity>
                            </View>
                          )}
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
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }}
                        >
                          <UserBidMessage bidDetails={message} />
                        </View>
                      );
                    } else if (message?.bidType === "false") {
                      return (
                        <View
                          key={message?._id}
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }}
                        >
                          <UserMessage bidDetails={message} />
                        </View>
                      );
                    } else if (message?.bidType === "location") {
                      return (
                        <View
                          key={message?._id}
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }}
                        >
                          <LocationMessage bidDetails={message} />
                        </View>
                      );
                    } else if (message?.bidType === "document") {
                      return (
                        <View
                          key={message?._id}
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }}
                        >
                          <UserDocumentMessage bidDetails={message} />
                        </View>
                      );
                    } else {
                      return (
                        <View
                          key={message?._id}
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }}
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
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                          }}
                        >
                          <RetailerBidMessage
                            bidDetails={message}
                            user={user}
                          />
                        </View>
                      );
                    } else if (message?.bidType === "document") {
                      return (
                        <View
                          key={message?._id}
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                          }}
                        >
                          <RetailerDocumentMessage bidDetails={message} />
                        </View>
                      );
                    } else {
                      return (
                        <View
                          key={message?._id}
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                          }}
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
        className={`absolute bottom-0 left-0 right-0 pt-[10] ${
          attachmentScreen ? "-z-50" : "z-50"
        } `}
      >
        {requestInfo?.requestType !== "closed" &&
        requestInfo?.bidCompleted !==true && !networkError && messages && messages.length > 0 &&
        messages[messages.length - 1]?.bidType!=="update" &&
          requestInfo?.requestType === "new" &&
          available === false && (
            <View className="gap-[20px]  items-center bg-white pt-[20px] shadow-2xl">
              <View className="flex flex-col justify-center items-center">
                <Text
                  className="text-[14px] text-center"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Are you accepting the customer request ?
                </Text>
               

                {messages && requestInfo && (
                  <View className="flex-row gap-[5px] mt-[10px] items-center justify-center">
                    <Text style={{ fontFamily: "Poppins-Medium" }} className="text-center">
                      {requestInfo?.requestId?.requestDescription}
                    </Text>
                    
                  </View>
                )}

                {messages &&
                  messages[messages.length - 1]?.bidImages &&
                  messages[messages.length - 1]?.bidImages?.length > 0 && (
                    <ScrollView horizontal  contentContainerStyle={{
                      paddingHorizontal: 10,
                      marginTop: 10,
                      flexDirection: "row",
                      gap: 4,
                    }}
                    showsHorizontalScrollIndicator={false}
                    style={{ maxHeight: 260 }}>
                  <View style={styles.container}>
                    <View style={styles.imageContainer}>
                      {messages[messages.length - 1]?.bidImages.map((image, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleImagePress(image)}
                        >
                          <View style={styles.imageWrapper}>
                            <Image
                              source={{ uri: image }}
                              style={styles.image}
                            />
                           
                          </View>
                        </Pressable>
                      ))}
                    </View>
                    <Modal
                      transparent
                      visible={!!selectedImage}
                      onRequestClose={handleClose}
                    >
                      <Pressable style={styles.modalContainer}  onPress={handleClose}>
                        <Animated.Image
                          source={{ uri: selectedImage }}
                          style={[
                            styles.modalImage,
                            {
                              transform: [{ scale: scaleAnimation }],
                            },
                          ]}
                        />
                        
                      </Pressable>
                    </Modal>
                  </View>
                </ScrollView>
                  )}



                {messages && messages[messages.length - 1]?.bidPrice>0 && (
                  <View className="flex-row gap-[5px] mt-[10px] items-center justify-center">
                    <Text style={{ fontFamily: "Poppins-Medium" }}>
                      Expected Price:{" "}
                    </Text>
                    <Text
                      className=" text-[#79B649]"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Rs. {messages[messages.length - 1]?.bidPrice}
                    </Text>
                  </View>
                )}

                <Text
                  className="text-[14px] text-center px-[10px] mt-2"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  ( Please confirm the product/service availability by accepting
                  this request )
                </Text>
              </View>



              <View className="w-full flex-row justify-between bg-white">
                <TouchableOpacity
                  onPress={() => {
                    user?.freeSpades > 0
                      ? (() => {
                          setAcceptRequestModal(true);
                          setType("Request");
                          SocketSetUp(currentRequest?.userId,currentRequest?.senderId)
                        })()
                      : setConfirmPaymentModal(true);
                  }}
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
          requestInfo?.requestType !== "rejected" &&
          requestInfo?.requestType !== "completed" &&
          requestInfo?.requestType !== "new" &&
          ((requestInfo?.requestId?.requestActive === "completed" &&
            requestInfo?.requestId?.requestAcceptedChat === user?._id) ||
            (messages[messages.length - 1]?.bidType === "true" &&
              messages[messages.length - 1]?.bidAccepted === "accepted") ||
            (messages[messages.length - 1]?.bidType === "true" &&
              messages[messages.length - 1]?.bidAccepted === "rejected") ||
            messages[messages.length - 1]?.bidType === "false" ||
            messages[messages.length - 1]?.bidType === "image" ||
            messages[messages.length - 1]?.bidType === "location" ||
            messages[messages.length - 1]?.bidType === "document") && (
            <View
              className="flex flex-row bg-white gap-2 items-center justify-center"
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
                <View className="h-[63px] flex  flex-1 items-center justify-center bg-white border-[1px] border-[#FB8C00] rounded-3xl">
                  <Text
                    className="text-[16px] text-[#fb8c00] text-center px-[10px]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    Send query message
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
                <View className="h-[63px] flex-row gap-1 flex-1 w-full items-center justify-center bg-white border-[1px] border-[#FB8C00] rounded-3xl px-[4px]">
                  <Document />
                  <Text
                    className=" text-[16px] text-[#fb8c00] text-center "
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    Send{"\n"} attachment
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        {requestInfo?.requestType !== "closed" &&
          requestInfo?.requestType !== "rejected" &&
          requestInfo?.requestType !== "completed" &&
          requestInfo?.requestId?.requestActive === "active" &&
          messages &&
          messages.length > 0 &&
          messages[messages.length - 1]?.bidType === "true" &&
          messages[messages.length - 1]?.bidAccepted === "new" &&
          messages[messages.length - 1]?.sender?.refId !== user?._id && (
            <View className="gap-[20px] items-center bg-white pt-[20px] shadow-2xl">
              <View className="flex flex-col justify-center items-center">
                <Text
                  className="text-[14px]  text-center"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Are you accepting the customer offer ?
                </Text>
                <Text
                  className="text-[14px]  text-center mt-[5px]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {messages[messages.length - 1]?.message}
                </Text>
                <View>
                  {messages &&
                    messages[messages.length - 1]?.bidImages &&
                    messages[messages.length - 1]?.bidImages?.length > 0 && (
                      <ScrollView horizontal  contentContainerStyle={{
                        paddingHorizontal: 10,
                        marginTop: 10,
                        flexDirection: "row",
                        gap: 4,
                      }}
                      showsHorizontalScrollIndicator={false}
                      style={{ maxHeight: 260 }}>
                    <View style={styles.container}>
                      <View style={styles.imageContainer}>
                        {messages[messages.length - 1]?.bidImages.map((image, index) => (
                          <Pressable
                            key={index}
                            onPress={() => handleImagePress(image)}
                          >
                            <View style={styles.imageWrapper}>
                              <Image
                                source={{ uri: image }}
                                style={styles.image}
                              />
                             
                            </View>
                          </Pressable>
                        ))}
                      </View>
                      <Modal
                        transparent
                        visible={!!selectedImage}
                        onRequestClose={handleClose}
                      >
                        <Pressable style={styles.modalContainer}  onPress={handleClose}>
                          <Animated.Image
                            source={{ uri: selectedImage }}
                            style={[
                              styles.modalImage,
                              {
                                transform: [{ scale: scaleAnimation }],
                              },
                            ]}
                          />
                          
                        </Pressable>
                      </Modal>
                    </View>
                  </ScrollView>
                    )}
                </View>
                {messages && messages[messages.length - 1]?.bidPrice && (
                  <View className="flex-row gap-[5px] mt-[10px] items-center justify-center">
                    <Text style={{ fontFamily: "Poppins-Medium" }}>
                      Offered Price:{" "}
                    </Text>
                    <Text
                      className=" text-[#79B649]"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Rs. {messages[messages.length - 1]?.bidPrice}
                    </Text>
                  </View>
                )}
              </View>

              <View className="w-full flex-row justify-between">
                <TouchableOpacity
                  onPress={() => {
                    setAcceptRequestModal(true);
                    setType("Offer");
                  }}
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
                        className="text-[16px] text-[#FB8C00]"
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
            messages[messages.length - 1]?.bidType === "image" ||
            messages[messages.length - 1]?.bidType === "location" ||
            messages[messages.length - 1]?.bidType === "document") && (
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
     
      <RequestAcceptModal
        user={user}
        modalVisible={acceptRequestModal}
        setModalVisible={setAcceptRequestModal}
        messages={messages}
        setMessages={setMessages}
        // requestInfo={requestInfo}
        type={type}
        setAcceptLocal={setAcceptLocal}
      />
      <ConfirmPaymentModal
        modalConfirmVisible={confirmPaymentModal}
        setModalConfirmVisible={setConfirmPaymentModal}
      />
      <UploadGSTModal
        modalConfirmVisible={uploadGSTModal}
        setModalConfirmVisible={setUploadGSTModal}
      />
       {errorModal && <ErrorModal errorModal={errorModal} setErrorModal={setErrorModal} />}

      {/* {closeRequestModal && <View style={styles.overlay} />} */}
      {acceptRequestModal && <View style={styles.overlay} />}
      {cancelRequestModal && <View style={styles.overlay} />}
      {confirmPaymentModal && <View style={styles.overlay} />}
      {uploadGSTModal && <View style={styles.overlay} />}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
      )}

      {/* {requestInfo?.requestType !== "closed" &&
            requestInfo?.requestType === "new" &&
            available === false &&
            <View style={styles.overlayimg} />
            } */}
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
  overlayimg: {
    zIndex: 100,
    // flex: 1,
    marginTop: 170,

    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    //  position:"absolute",
    //  bottom:0// Semi-transparent greyish background
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  // menuContainer: {
  //     flex: 1,
  //     // Add other styles for menu container
  // },
  attachments: {
    zIndex: 100, // Ensure the overlay is on top
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: 30,
    gap: 5,
    marginTop: 10,
  },
  imageWrapper: {
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    // borderWidth: 1,
    // borderColor: "gray",
  },
  image: {
    width: 174,
    height: 232,
    borderRadius: 10,
  },
  // deleteIc: {
  //   position: 'absolute',
  //   top: 5,
  //   right: 5,
  // },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 2,
  },
  
});

export default RequestPage;
