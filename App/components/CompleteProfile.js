import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Location from "../assets/location.svg";
import Store from "../assets/store.svg";
import Arrow from "../assets/rightarrow.svg";
import Tick from "../assets/tick.svg";
import Line from "../assets/line.svg";
import { useFocusEffect, useIsFocused, useNavigation, useNavigationState } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import HomeScreenUnverified from "./HomeScreenUnverified";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Profile from "../assets/ProfileIcon.svg"
import GinieIcon from "../assets/GinieBusinessIcon.svg"
import History from "../assets/HistoryIcon.svg"
import { setAccessToken, setUserDetails } from "../redux/reducers/storeDataSlice";
import axios from "axios";
import { baseUrl } from "../screens/utils/constants";
import axiosInstance from "../screens/utils/axiosInstance";

const CompleteProfile = () => {
  const navigation = useNavigation();

  // const serviceProvider = useSelector(
  //   (state) => state.storeData.serviceProvider
  // );
const user= useSelector(state => state.storeData.userDetails)
console.log(user)
const dispatch=useDispatch();
const [refreshing,setRefreshing]=useState(false);
const isFocused = useIsFocused();


const navigationState = useNavigationState(state => state);
const isCompleteProfileScreen = navigationState.routes[navigationState.index].name === 'completeProfile';

  console.log("services", user?.serviceProvider,isCompleteProfileScreen);
  console.log("profile", user?.profileCompleted);




  const handleLocation = () => {
    if (!user?.lattitude) {
      navigation.navigate("locationScreen", { data: "notservice" });
    }
  };
  const handleServiceLocation = () => {
    if (!user?.lattitude && user?.storeImages?.length === 0) {
      navigation.navigate("locationScreen", { data: "service" });
    }
  };
  const handleStore = () => {
    if (user?.storeImages?.length === 0 && user?.serviceProvider !== "true") {
      navigation.navigate("writeAboutStore");
    }
  };




//   console.log("userDta at home",userData);

  useEffect(() => {
    const backAction = () => {
      if (isCompleteProfileScreen) {
        BackHandler.exitApp();
        return true; 
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress', 
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [isCompleteProfileScreen]);

  

const fetchUserData = async () => {
  try {
   

    const response = await axios.get(`${baseUrl}/retailer/`, {
      params: {
        storeMobileNo: user?.storeMobileNo
      }
    });
    console.log("res at compltete profile", response.data);

    if (response.status === 200) {
      const data = response.data.retailer;
      dispatch(setAccessToken(response.data.accessToken));
      await AsyncStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
      dispatch(setUserDetails(data));
     

      if (data?.storeApproved==="approved") {
        console.log('Store approved at profile Screen');
        // setVerified(true);
        navigation.navigate("home", { data: "" });
      } 
     

      if ((data?.lattitude && data?.serviceProvider === "true") || (data?.lattitude && data.storeImages?.length > 0)) {
        // setCompleteProfile(true);
        console.log("profile updated successfully")
        const config = {
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${response.data.accessToken}`,
          }
         }
        const res = await axiosInstance.patch(
          `${baseUrl}/retailer/editretailer`,
          {
            _id:user?._id,
            profileCompleted:true
          },config
        );
        console.log("profile updated successfully",res.data);
        dispatch(setUserDetails(res.data));
        await AsyncStorage.setItem('userData', JSON.stringify(res.data));

      } 
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      console.log('User data fetched at complete profile', data);
    }
  } catch (error) {
    console.error('Error fetching user data on home screen:', error);
  }
};


// const handleRefresh = useCallback(() => {
//   setRefreshing(true);
//   fetchUserData().finally(() => {
//     setRefreshing(false);
//   });
// }, []);

useEffect(()=>{
    if(isFocused) {
     fetchUserData();
    
  }}, [isFocused])







  return (
    <View className="flex-1 bg-white ">
            <ScrollView
          //   refreshControl={
          // <RefreshControl
          //    refreshing={refreshing}
          //   onRefresh={handleRefresh}
          //    colors={["#9Bd35A", "#689F38"]

          //   }
          // />}
          >
            <View className="flex flex-col mt-[20px]  gap-[32px] ">
                <View className="flex flex-row justify-between items-center px-[32px]">
                  
                        <TouchableOpacity onPress={()=>navigation.navigate("menu")} style={{padding:4}}>
                           <View className="bg-[#FB8C00] p-[4px] rounded-full">
                            <Profile />
                            </View>
                        </TouchableOpacity>
                   
                    <GinieIcon/>
                    
                        <TouchableOpacity onPress={()=>navigation.navigate("history")} style={{padding:4}}>
                        <View className="bg-[#FB8C00] p-[4px] rounded-full">
                            <History height={28} width={28}/>
                            </View>
                        </TouchableOpacity>
                   
                    
                </View>
    <View className="gap-[17px] mb-[20px] bg-white">
      {!user?.profileCompleted ? (
        <Text className="text-[14px] text-center text-[#2E2C43]" style={{ fontFamily: "Poppins-Bold" }}>
          Please complete your store profile {"\n"} before starting
        </Text>
      ) : (
        <View className="flex-row gap-[5px] items-center justify-center">
          <View className="w-[16px] h-[16px] bg-[#E76063] rounded-full"></View>
          <Text className="text-[14px] text-[#2E2C43]" style={{ fontFamily: "Poppins-Bold" }}>
            {" "}
            Wait for request approval
          </Text>
        </View>
      )}

      {user?.serviceProvider !== "true" && (
        <View className="flex items-center gap-[10px]">
          <TouchableOpacity
            disabled={user?.serviceProvider === "true"}
            onPress={handleLocation}
            style={{
              backgroundColor: '#fff', // Ensure the background is white
              margin: 10, // Add some margin if necessary for better shadow visibility
              shadowColor: '#bdbdbd',
              shadowOffset: { width: 8, height: 6 },
              shadowOpacity: 0.9,
              shadowRadius: 24,
              elevation: 20,
              borderRadius:24
            }}
          >
            <View className="w-[95%] flex-row items-center bg-white gap-[15px] h-[127px] rounded-3xl shadow-3xl px-[18px]">
              <View className="w-full flex-row gap-[30px]">
                <View>
                  <Location />
                </View>

                <View className="flex flex-1">
                  <Text className="text-[14px] text-[#2E2C43]" style={{ fontFamily: "Poppins-Bold" }}>
                   
                    Set Store Location{" "}
                  </Text>
                  <Text className="text-[12px] text-[#2E2C43]" style={{ fontFamily: "Poppins-Regular" }}>
                  We are fetching your location{"\n"}to help customers find your shop.
                  </Text>
                </View>
                <View className="flex-row gap-[8px]">
                  {user?.lattitude && user?.serviceProvider === "false" ? (
                    <Tick />
                  ) : (
                    <Arrow />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={user?.serviceProvider === "true"}
            onPress={handleStore}
            style={{
              backgroundColor: '#fff', // Ensure the background is white
              margin: 10, // Add some margin if necessary for better shadow visibility
              shadowColor: '#bdbdbd',
              shadowOffset: { width: 8, height: 6 },
              shadowOpacity: 0.9,
              shadowRadius: 24,
              elevation: 20,
              borderRadius:24
            }}
          >
            <View className="w-[95%] flex-row items-center bg-white gap-[15px] h-[127px] rounded-3xl shadow-3xl px-[18px]">
              <View className="w-full flex-row gap-[30px]">
                <View>
                  <Store />
                </View>

                <View className="flex flex-1 ">
                  <Text className="text-[14px] text-[#2E2C43]" style={{ fontFamily: "Poppins-Bold" }}>
                   
                    Complete store profile{" "}
                  </Text>
                  <Text className="text-[12px] text-[#2E2C43]"  style={{ fontFamily: "Poppins-Regular" }}>
                  Add store images for easy store identification.
                  </Text>
                </View>
                <View className="flex-row gap-[8px]">
                  {user?.storeImages?.length === 0 ? <Arrow /> : <Tick />}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
      <View className="mt-[10px] flex items-center justify-center gap-[5px]">
      {((user?.serviceProvider !== "true" && user?.serviceProvider!=="false" && user?.storeImages?.length === 0)) && ( 
      <View className="gap-[30px]">
         
            <View className="flex-row items-center justify-between gap-[20px]">
              <Line />
              <Text style={{ fontFamily: "Poppins-SemiBold" }} className="text-[#2E2C43]">OR</Text>
              <Line />
            </View>
          

          <View>
            <Text className="text-[14px]  text-center text-[#2E2C43]" style={{ fontFamily: "Poppins-Bold" }}>
            Are you an independent maintenance service provider? {" "}
            </Text>
            <Text className="text-[14px]  text-center text-[#2E2C43]" style={{ fontFamily: "Poppins-Light" }}>
            like; Plumber, electrician, carpenter etc.
            </Text>
            <Text className="text-[14px]  text-center text-[#2E2C43]" style={{ fontFamily: "Poppins-Light" }}>
              (Don’t have store / shop)
            </Text>
          </View>
        </View>
      )}
      {
        user?.serviceProvider  !== "false" && user?.storeImages?.length === 0 && 
        <TouchableOpacity
          
          onPress={handleServiceLocation}
          style={{
            backgroundColor: '#fff', // Ensure the background is white
            margin: 10, // Add some margin if necessary for better shadow visibility
            shadowColor: '#bdbdbd',
            shadowOffset: { width: 8, height: 6 },
            shadowOpacity: 0.9,
            shadowRadius: 24,
            elevation: 20,
            borderRadius:24
          }}
        >
          <View className="w-[95%] flex-row items-center bg-white gap-[15px] h-[127px] rounded-3xl shadow-3xl px-[18px]">
            <View className="w-full flex-row gap-[30px]">
              <View>
                <Location />
              </View>

              <View className="flex flex-1">
                <Text className="text-[14px] text-[#2E2C43]" style={{ fontFamily: "Poppins-Bold" }}>
                
                  Set Your Location{" "}
                </Text>
                <Text className="text-[12px] text-[#2E2C43]" style={{ fontFamily: "Poppins-Regular" }}>
                We are fetching your location{"\n"}to help customers find your service region.
                </Text>
              </View>
              <View className="flex-row gap-[8px]">
                {user?.lattitude  && user?.serviceProvider  === "true" ? <Tick /> : <Arrow />}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      }
        
      </View>
      {user?.profileCompleted && <HomeScreenUnverified />}
    </View>
    </View>
            </ScrollView>

        </View>
  );
};

export default CompleteProfile;

// const styles = StyleSheet.create({})
