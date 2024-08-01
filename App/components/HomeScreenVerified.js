import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  AppState,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setCurrentRequest,
  setNewRequests,
  setOngoingRequests,
  setRequestInfo,
  setRetailerHistory,
} from "../redux/reducers/requestDataSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import HomeScreenRequests from "./HomeScreenRequests";
import ProductOrderCard from "./ProductOrderCard";
import { SafeAreaView } from "react-native-safe-area-context";
import messaging from "@react-native-firebase/messaging";
import { notificationListeners } from "../notification/notificationServices";
import RequestLoader from "../screens/utils/RequestLoader";
import { socket } from "../screens/utils/socket.io/socket";
import { daysDifference, formatDateTime } from "../screens/utils/lib";
import CustomerRemain from "../assets/CustomerRemainImg.svg";
import GSTVerify from "../assets/GSTVerifyImg.svg";
import QueIcon from "../assets/QuestionIcon.svg";
import RightArrow from "../assets/RightArrowGold.svg";
import Time from "../assets/TimeRed.svg";
import RemainingCustomerModal from "./RemainingCustomerModal";
import { baseUrl } from "../screens/utils/constants";
import axiosInstance from "../screens/utils/axiosInstance";
import NetworkError from "./NetworkError";
import Profile from "../assets/ProfileIcon.svg";
import GinieIcon from "../assets/GinieBusinessIcon.svg";
import History from "../assets/HistoryIcon.svg";

const HomeScreenVerified = ({ modalVisible, setModalVisible }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState("New");
  const [request, setRequest] = useState(true);

  const newRequests = useSelector(
    (state) => state.requestData.newRequests || []
  );
  const ongoingRequests = useSelector(
    (state) => state.requestData.ongoingRequests || []
  );
  const retailerHistory = useSelector(
    (state) => state.requestData.retailerHistory || []
  );
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userData = useSelector((state) => state.storeData.userDetails);
  const isFirstLoad = useRef(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const accessToken = useSelector((state) => state.storeData.accessToken);
  const [networkError, setNetworkError] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  // ////////////////////////////////////Connecting socket from when app goes from backgroun to foreground/////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        connectSocket();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState at home", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const connectSocket = useCallback(async () => {
    // socket.emit("setup", currentSpadeRetailer?.users[1]._id);
    const userDetailsData = JSON.parse(await AsyncStorage.getItem("userData"));
    const userId = userDetailsData?._id;
    const senderId = userDetailsData?._id;
    if (userId && senderId) socket.emit("setup", { userId, senderId });
    //  console.log('Request connected with socket with id', spadeId);
    socket.on("connected", () => setSocketConnected(true));
    console.log("Home Screen socekt connect with id");
  });

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    const handleMessageReceived = (updatedUser) => {
      console.log(
        "Updated user data received at socket",
        updatedUser?._id,
        updatedUser?.latestMessage.message,
        updatedUser?.unreadCount
      );

      console.log("ongoing requests", ongoingRequests?.length, updatedUser);

      if (
        updatedUser?.latestMessage?.bidType === "update" &&
        updatedUser?.requestType === "new"
      ) {
        const filteredRequests = newRequests.filter(
          (request) => request?._id !== updatedUser?._id
        );
        // console.log("ongoing requests", filteredRequests.length);

        const updatedRequest = [updatedUser, ...filteredRequests];
        dispatch(setNewRequests(updatedRequest));
      } else {
        const filteredRequests = ongoingRequests.filter(
          (request) => request?._id !== updatedUser?._id
        );
        // console.log("ongoing requests", filteredRequests.length);

        const updatedRequest = [updatedUser, ...filteredRequests];
        dispatch(setOngoingRequests(updatedRequest));
      }
    };

    socket.on("updated retailer", handleMessageReceived);

    // Cleanup the effect
    return () => {
      socket.off("updated retailer", handleMessageReceived);
    };
  }, [dispatch, ongoingRequests]);

  useEffect(() => {
    const handleNewRequest = (updatedUser) => {
      console.log("New Request  received at socket", updatedUser?._id);

      // console.log("ongoing requests", filteredRequests.length)

      const updatedRequest = [updatedUser, ...newRequests];
      dispatch(setNewRequests(updatedRequest));
    };

    socket.on("fetch newRequest", handleNewRequest);

    return () => {
      socket.off("fetch newRequest", handleNewRequest);
    };
  }, [dispatch, newRequests]);

  // const remainingDays =
  //   daysDifference(userData?.createdAt) > 60
  //     ? 0
  //     : 60 - daysDifference(userData?.createdAt);

  useEffect(() => {
    console.log("request refreshing");
    handleRefresh();
  }, []);

  const fetchNewRequests = async () => {
    setLoading(true);
    try {
      // const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      console.log("hii", userData._id);
      const response = await axiosInstance.get(
        `${baseUrl}/chat/retailer-new-spades?id=${userData?._id}`,
        config
      );

      if (response.data) {
        // console.log("hiii verified",response.data);
        dispatch(setNewRequests(response.data));
      }
    } catch (error) {
      dispatch(setNewRequests([]));

      if (!error?.response?.status) {
        // console.log("hii net")
        setNetworkError(true);
      }

      // console.error('Error fetching new requests:', error);
    }
  };

  const fetchOngoingRequests = async () => {
    try {
      // const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const ongoingresponse = await axiosInstance.get(
        `${baseUrl}/chat/retailer-ongoing-spades?id=${userData?._id}`,
        config
      );
      if (ongoingresponse.data) {
        // console.log("hiiiuu");
        dispatch(setOngoingRequests(ongoingresponse.data));
      }
    } catch (error) {
      dispatch(setOngoingRequests([]));
      if (!error?.response?.status) {
        console.log("hii net");
        setNetworkError(true);
      }

      //console.error('Error fetching ongoing requests:', error);
    }
  };

  const fetchRetailerHistory = async () => {
    try {
      // const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const history = await axiosInstance.get(
        `${baseUrl}/retailer/history?id=${userData?._id}`,
        config
      );
      if (history.data) {
        dispatch(setRetailerHistory(history.data));
      }
      setLoading(false);
      // console.log("history", history.data);
    } catch (error) {
      dispatch(setRetailerHistory([]));
      // console.error('Error fetching history requests:', error);
    }
  };

  const handleRefresh = () => {
    // Show the refresh indicator
    
    try {
      // Fetch new data from the server
      console.log("Refreshing");
      fetchNewRequests();
      fetchOngoingRequests();
      fetchRetailerHistory();
      


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const refreshHandler = () => {
    setRefreshing(true);
    // setLoading(true)
    connectSocket();
    handleRefresh();
    setRefreshing(false)
      // setLoading(false);
      // setRefreshing(false);
  
  };

  // useEffect(() => {
  //   socket.emit("setup", userData?._id);
  // }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        dispatch(setRequestInfo(item));
        // console.log(item)
        const req = {
          requestId: item?._id,
          userId: item?.users[0]?._id,
          senderId: item?.users[1]?._id,
        };
        const requestId = req?.requestId;
        dispatch(setCurrentRequest(req));
        // console.log("request details", req);
        setTimeout(() => {
          navigation.navigate(`requestPage${requestId}`);
        }, 200);
      }}
      style={{
        backgroundColor: "#fff", // Ensure the background is white
        margin: 10, // Add some margin if necessary for better shadow visibility
        shadowColor: "#bdbdbd",
        shadowOffset: { width: 8, height: 6 },
        shadowOpacity: 0.9,
        shadowRadius: 24,
        elevation: 20,
        borderRadius: 24,
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.05)",
      }}
    >
      <ProductOrderCard product={item} />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshHandler}
            colors={["#9Bd35A", "#FB8C00"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-col mt-[20px]  gap-[32px] ">
          <View
            className="flex flex-row justify-between items-center px-[32px]"
            style={{ zIndex: 10 }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("menu")}
              style={{ padding: 8 }}
            >
              <View className="bg-[#FB8C00] p-[4px] rounded-full">
                <Profile />
              </View>
            </TouchableOpacity>

            <GinieIcon />

            <TouchableOpacity
              onPress={() => navigation.navigate("history")}
              style={{ padding: 8 }}
            >
              <View className="bg-[#FB8C00] p-[4px] rounded-full">
                <History height={28} width={28} />
              </View>
            </TouchableOpacity>
          </View>

          {(newRequests?.length > 0 ||
            ongoingRequests?.length > 0 ||
            retailerHistory?.length > 0) && (
            <View className="flex items-center">
              <View>
                <View className="flex-row justify-center gap-[40px] px-[10px]    mb-[20px]">
                  <TouchableOpacity onPress={() => setTab("New")}>
                    <View className="flex-row  gap-[5px]   p-[4px]">
                      <Text
                        style={{
                          fontFamily:
                            tab === "New" ? "Poppins-Bold" : "Poppins-Regular",
                          borderBottomWidth: tab === "New" ? 3 : 0,
                          borderBottomColor: "#FB8C00",
                        }}
                        className=""
                      >
                        New Requests
                      </Text>
                      {newRequests && newRequests?.length > 0 && (
                        <View className="bg-[#E76063] absolute -right-[18px] -top-[8px] h-[22px] flex justify-center items-center w-[22px]  rounded-full ">
                          <Text
                            className="text-white"
                            style={{ fontFamily: "Poppins-Regular" }}
                          >
                            {newRequests ? newRequests.length : 0}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTab("Ongoing")}>
                    <View className="flex-row gap-[5px]  p-[4px]">
                      <Text
                        style={{
                          fontFamily:
                            tab === "Ongoing"
                              ? "Poppins-Bold"
                              : "Poppins-Regular",

                          borderBottomWidth: tab === "Ongoing" ? 3 : 0,
                          borderBottomColor: "#FB8C00",
                        }}
                      >
                        Ongoing Requests
                      </Text>
                      {ongoingRequests && ongoingRequests?.length > 0 && (
                        <View className="bg-[#E76063] absolute -right-[18px] -top-[8px] h-[22px] flex justify-center items-center w-[22px]  rounded-full">
                          <Text
                            className="text-white  "
                            style={{ fontFamily: "Poppins-Regular" }}
                          >
                            {ongoingRequests ? ongoingRequests.length : 0}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                
                {tab === "New" && (
                  <>
                    {/* customer remaining card */}
                    <View
                      style={{
                        backgroundColor: "#fff", // Ensure the background is white
                        margin: 10, // Add some margin if necessary for better shadow visibility
                        shadowColor: "#bdbdbd",
                        shadowOffset: { width: 8, height: 6 },
                        shadowOpacity: 0.9,
                        shadowRadius: 24,
                        elevation: 20,
                        borderRadius: 24,
                      }}
                    >
                      <View className="max-w-[340px] flex flex-row p-[20px] gap-[20px] items-center">
                        <CustomerRemain width={92} height={76} />
                        <View className="w-10/12 flex-col gap-[5px]">
                          <View className="flex-row gap-[10px]">
                            <Text
                              className="text-[14px]"
                              style={{ fontFamily: "Poppins-Regular" }}
                            >
                              Customer Remaining
                            </Text>
                            <TouchableOpacity
                              onPress={() => setModalVisible(true)}
                            >
                              <QueIcon />
                            </TouchableOpacity>
                          </View>
                          <Text
                            className={`text-[24px]  ${
                              userData?.freeSpades <= 50
                                ? "text-[#E76063]"
                                : "text-[#FB8C00]"
                            }`}
                            style={{ fontFamily: "Poppins-Black" }}
                          >
                            {userData?.freeSpades} / 1000
                          </Text>
                          {/* <TouchableOpacity>
                            <View className="flex flex-row items-center gap-[10px]">
                            <Text className="text-[14px] text-[#FB8C00]" style={{ fontFamily: "Poppins-Regular" }}>
                                Add more
                              </Text>
                            <RightArrow/>

                            </View>

                          </TouchableOpacity> */}
                        </View>
                      </View>
                    </View>
                    {/* gst verification card */}
                    {!userData.documentVerified && (
                      <View
                        style={{
                          backgroundColor: "#fff", // Ensure the background is white
                          margin: 10, // Add some margin if necessary for better shadow visibility
                          shadowColor: "#bdbdbd",
                          shadowOffset: { width: 8, height: 6 },
                          shadowOpacity: 0.9,
                          shadowRadius: 24,
                          elevation: 20,
                          borderRadius: 24,
                        }}
                        className="max-w-[340px]"
                      >
                        <View className="w-full flex flex-row p-[20px] gap-[20px] items-center">
                          <GSTVerify width={80} height={60} />
                          <View className="w-10/12 px-[10px] flex-col gap-[5px]">
                            <View className="w-full flex-row gap-[10px]">
                              <Text
                                className="text-[14px]"
                                style={{ fontFamily: "Poppins-Regular" }}
                              >
                                Attach your GST/Labor{"\n"}certificate
                              </Text>
                            </View>

                            {userData.panCard?.length == 0 && (
                              <TouchableOpacity
                                onPress={() => navigation.navigate("gstVerify")}
                              >
                                <View className="flex flex-row items-center gap-[10px]">
                                  <View className="flex flex-row items-center gap-[10px]">
                                    <Text
                                      className="text-[14px] text-[#FB8C00]"
                                      style={{ fontFamily: "Poppins-Regular" }}
                                    >
                                      Add Now
                                    </Text>
                                    <RightArrow />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )}
                            {userData.panCard?.length > 0 &&
                              !userData?.documentVerified && (
                                <Text
                                  className="text-[14px] text-[#E76063]"
                                  style={{ fontFamily: "Poppins-Regular" }}
                                >
                                  Waiting for approval
                                </Text>
                              )}
                          </View>
                        </View>
                      </View>
                    )}
                 {loading ? (
                  <View className="flex justify-center items-center">
                <RequestLoader/>
                       
                  </View>
              ) : (
                <>
                    <FlatList
                      data={newRequests}
                      renderItem={renderItem}
                      keyExtractor={(item) => {
                        if (!item?._id) {
                          // console.error('Item without _id:', item);
                          return Math.random().toString();
                        }
                        return item?._id.toString();
                      }}
                      ListEmptyComponent={
                        <Text
                          className="text-[14px] text-center mb-[20px] mt-[20px]"
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          No New Requests
                        </Text>
                      }
                    />
                  </>
                )}
                </>
                )
              }


{loading ? (
                 
                <RequestLoader/>
                       
            
              ) : (
                <>
                {tab === "Ongoing" && (
                  <FlatList
                    data={ongoingRequests}
                    renderItem={renderItem}
                    keyExtractor={(item) => {
                      if (!item?._id) {
                        // console.error('Item without _id:', item);
                        return Math.random().toString();
                      }
                      return item?._id.toString();
                    }}
                    ListEmptyComponent={
                      <Text
                        className="text-[14px] text-center mb-[20px]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        No Ongoing Requests
                      </Text>
                    }
                  />
                )}
                </>)}
              </View>
            </View>
          )}
          {networkError && (
            <View
              style={{
                marginTop: 80,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 120,
              }}
            >
              <NetworkError
                callFunction={refreshHandler}
                setNetworkError={setNetworkError}
              />
            </View>
          )}

          {!(
            newRequests?.length > 0 ||
            ongoingRequests?.length > 0 ||
            retailerHistory?.length > 0
          ) &&
            !networkError && (
              <HomeScreenRequests
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
              />
            )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent greyish background
  },
});

export default HomeScreenVerified;
