import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setNewRequests,
  setOngoingRequests,
  setRequestInfo,
  setRetailerHistory,
} from "../redux/reducers/requestDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import HomeScreenRequests from "./HomeScreenRequests";
import ProductOrderCard from "./ProductOrderCard";
import { SafeAreaView } from "react-native-safe-area-context";
import messaging from "@react-native-firebase/messaging";
import { notificationListeners } from "../notification/notificationServices";
import RequestLoader from "../screens/utils/RequestLoader";
import { socket } from "../screens/utils/socket.io/socket";

const HomeScreenVerified = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState("New");
  const [request, setRequest] = useState(false);
  const newRequests = useSelector(
    (state) => state.requestData.newRequests || []
  );
  const ongoingRequests = useSelector(
    (state) => state.requestData.ongoingRequests || []
  );
  const retailerHistory= useSelector(state => state.requestData.retailerHistory|| []) 
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userData= useSelector(state => state.storeData.userDetails)
  //  console.log("user at verified",userData)


  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  // useEffect(()=>{

  //   if(requestUserPermission()){
  //       messaging().getToken().then(token=>{
  //         console.log(token)
  //       })
  //   }
  //   else{
  //     console.log("permission not granted",authStatus);
  //   }
  //   // createNotificationChannels();
  //   notificationListeners();

  // },[]);

  useEffect(() => {
    if (isFocused) {
      handleRefresh();
      // 
    }
  }, [isFocused]);

  const fetchNewRequests = async () => {
    setLoading(true);
    try {
      // const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      const response = await axios.get(
        `https://culturtap.com/api/chat/retailer-new-spades?id=${userData?._id}`
      );
      if(response.data){
      setRequest(true);
      console.log("hiii")
      dispatch(setNewRequests(response.data));
      setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      dispatch(setNewRequests([]));
      // console.error('Error fetching new requests:', error);
    }
  };

  const fetchOngoingRequests = async () => {
 setIsLoading(true);

  
    try {
      // const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      const ongoingresponse = await axios.get(
        `https://culturtap.com/api/chat/retailer-ongoing-spades?id=${userData?._id}`
      );
      if(ongoingresponse.data){
      setRequest(true);
      console.log("hiiiuu")
      dispatch(setOngoingRequests(ongoingresponse.data));
      setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      dispatch(setOngoingRequests([]));
      //console.error('Error fetching ongoing requests:', error);
    }


  };

  const fetchRetailerHistory = async () => {
    try {
      // const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      const history = await axios.get(
        `https://culturtap.com/api/retailer/history?id=${userData?._id}`
      );
      if(history.data){
      setRequest(true);
      dispatch(setRetailerHistory(history.data));
      }
      // console.log("history",history.data);
    } catch (error) {
      dispatch(setRetailerHistory([]));
      //console.error('Error fetching ongoing requests:', error);
    }

    
  };

  const handleRefresh = () => {
    setRefreshing(true); // Show the refresh indicator
   
    try {
      // Fetch new data from the server
      fetchNewRequests();
      fetchOngoingRequests();
      fetchRetailerHistory();
      if(newRequests?.length>0 || ongoingRequests?.length>0 || retailerHistory?.length>0){
        console.log("updated request")
            setRequest(true);
      }
       else{
          setRequest(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
    setRefreshing(false); // Hide the refresh indicator
  };



 

  // Setting socket for requests

  useEffect(()=> {
    socket.emit("setup", userData?._id);

  },[]);



  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#9Bd35A", "#689F38"]}
          />
        }
      >
         {!request && <HomeScreenRequests />}
        {request && (
          <View className="flex items-center">
            <View>
              <View className="flex-row justify-between px-[20px]  gap-[5x]">
                <TouchableOpacity onPress={() => setTab("New")}>
                  <View className="flex-row  gap-[5px]  items-center p-[4px]">
                    <Text
                      style={{
                        fontFamily:tab==="New"?"Poppins-Bold":"Poppins-Regular",
                        borderBottomWidth: tab === "New" ? 3 : 0,
                        borderBottomColor: "#FB8C00",
                      }}
                    >
                      New Requests
                    </Text>
                    <View className="bg-[#E76063] h-[22px] flex justify-center items-center w-[22px]  rounded-full">
                      <Text className="text-white  " style={{ fontFamily: "Poppins-Regular" }}>
                        {newRequests ? newRequests.length : 0}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTab("Ongoing")}>
                  <View className="flex-row gap-[5px] items-center p-[4px]">
                    <Text
                      style={{
                        fontFamily:tab==="Ongoing"?"Poppins-Bold":"Poppins-Regular",

                        borderBottomWidth: tab === "Ongoing" ? 3 : 0,
                        borderBottomColor: "#FB8C00",
                      }}
                    >
                      Ongoing Requests
                    </Text>
                    <View className="bg-[#E76063] h-[22px] flex justify-center items-center w-[22px]  rounded-full">
                      <Text className="text-white  " style={{ fontFamily: "Poppins-Regular" }}>
                        {ongoingRequests ? ongoingRequests.length : 0}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              {tab === "New" && (
                <SafeAreaView className="flex-1">
                  {/* <Text className="text-[14px] text-center mb-[20px]">Your ongoing requests</Text> */}
                  {!loading && (
                    <View className=" flex flex-col gap-[10px] mb-[20px] items-center justify-center">
                      {newRequests && newRequests.length > 0 ? (
                        newRequests.map((product) => (
                          <TouchableOpacity
                            key={product._id}
                            onPress={() => {
                              dispatch(setRequestInfo(product));
                              navigation.navigate("requestPage");
                            }}
                            style={{
                              backgroundColor: '#fff', // Ensure the background is white
                              margin: 10, // Add some margin if necessary for better shadow visibility
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.3,
                              shadowRadius: 4,
                              elevation: 5,
                              borderRadius:16
                            }}
                          >
                            <ProductOrderCard
                              key={product._id}
                              product={product}
                            />
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text className="text-[14px] text-center mb-[20px]" style={{ fontFamily: "Poppins-Regular" }}>
                          No New Requests
                        </Text>
                      )}
                    </View>
                  )}
                  {loading && <RequestLoader />}
                </SafeAreaView>
              )}
              {tab === "Ongoing" && (
                <SafeAreaView className="flex-1">
                  {/* <Text className="text-[14px] text-center mb-[20px]">Your ongoing requests</Text> */}
                  {!loading && (
                    <View className=" flex flex-col gap-[10px] mb-[20px] items-center justify-center">
                      {ongoingRequests && ongoingRequests.length > 0 ? (
                        ongoingRequests?.map((product) => (
                          <TouchableOpacity
                            key={product._id}
                            onPress={() => {
                              dispatch(setRequestInfo(product));
                              console.log("requestInfo at homeScreen", product);
                              navigation.navigate("requestPage");
                            }}
                            style={{
                              backgroundColor: '#fff', // Ensure the background is white
                              margin: 10, // Add some margin if necessary for better shadow visibility
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.3,
                              shadowRadius: 4,
                              elevation: 5,
                              borderRadius:16
                            }}
                          >
                            <ProductOrderCard
                              key={product._id}
                              product={product}
                            />
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text className="text-[14px] text-center mb-[20px]" style={{ fontFamily: "Poppins-Regular" }}>
                          No Ongoing Requests
                        </Text>
                      )}
                    </View>
                  )}
                  {isLoading && <RequestLoader />}
                </SafeAreaView>
              )}
            </View>
          </View>
        )}
       
      </ScrollView>
    </View>
  );
};

export default HomeScreenVerified;
