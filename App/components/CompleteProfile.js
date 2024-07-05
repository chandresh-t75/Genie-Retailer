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
import { setUserDetails } from "../redux/reducers/storeDataSlice";
import axios from "axios";

const CompleteProfile = () => {
  const navigation = useNavigation();

  // const serviceProvider = useSelector(
  //   (state) => state.storeData.serviceProvider
  // );
const user= useSelector(state => state.storeData.userDetails)
const dispatch=useDispatch();
const [refreshing,setRefreshing]=useState(false);
const isFocused = useIsFocused();


const navigationState = useNavigationState(state => state);
const isCompleteProfileScreen = navigationState.routes[navigationState.index].name === 'completeProfile';

  console.log("services", user.serviceProvider,isCompleteProfileScreen);
  console.log("profile", user.profileCompleted);




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
   

    const response = await axios.get('http://173.212.193.109:5000/retailer/', {
      params: {
        storeMobileNo: user?.storeMobileNo
      }
    });
    console.log("res at compltete profile", response.data);

    if (response.status === 200) {
      const data = response.data;

      dispatch(setUserDetails(data));
     

      if (data.storeApproved) {
        console.log('Store approved at profile Screen');
        // setVerified(true);
        navigation.navigate("home", { data: "" });
      } 
     

      if ((data.lattitude && data.serviceProvider === "true") || (data.lattitude && data.storeImages?.length > 0)) {
        // setCompleteProfile(true);
        console.log("profile updated successfully")
        const res = await axios.patch(
          `http://173.212.193.109:5000/retailer/editretailer`,
          {
            _id:user?._id,
            profileCompleted:true
          }
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
      {!user.profikeCompleted ? (
        <Text className="text-[14px] text-center" style={{ fontFamily: "Poppins-Bold" }}>
          Please complete your store profile {"\n"} before starting
        </Text>
      ) : (
        <View className="flex-row gap-[5px] items-center justify-center">
          <View className="w-[16px] h-[16px] bg-[#E76063] rounded-full"></View>
          <Text className="text-[14px] " style={{ fontFamily: "Poppins-Bold" }}>
            {" "}
            Wait for request approval
          </Text>
        </View>
      )}

      {user.serviceProvider !== "true" && (
        <View className="flex items-center gap-[10px]">
          <TouchableOpacity
            disabled={user?.serviceProvider === "true"}
            onPress={handleLocation}
            style={{
              backgroundColor: '#fff', // Ensure the background is white
              // Add some margin if necessary for better shadow visibility
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
              borderRadius:10
            }}
          >
            <View className="w-[90%] flex-row items-center bg-white gap-[15px] h-[127px] rounded-3xl shadow-3xl px-[18px]">
              <View className="w-full flex-row justify-between">
                <View>
                  <Location />
                </View>

                <View className="flex ">
                  <Text className="text-[14px] " style={{ fontFamily: "Poppins-Bold" }}>
                    {" "}
                    Set Store Location{" "}
                  </Text>
                  <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>
                    We are fetching your location for the {"\n"}
                    purchase reference of our customers
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
              // Add some margin if necessary for better shadow visibility
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
              borderRadius:10
            }}
          >
            <View className="w-[90%] flex-row items-center bg-white gap-[15px] h-[127px] rounded-3xl shadow-3xl px-[18px]">
              <View className="w-full flex-row justify-between">
                <View>
                  <Store />
                </View>

                <View className="flex ">
                  <Text className="text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>
                    {" "}
                    Complete store profile{" "}
                  </Text>
                  <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>
                    We are fetching your location for the {"\n"}
                    purchase reference of our customers
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
      <View className="mt-[10px]flex items-center justify-center gap-[20px]">
      {((user?.serviceProvider !== "true" && user?.serviceProvider!=="false" && user?.storeImages?.length === 0)) && ( 
      <View className="gap-[30px]">
         
            <View className="flex-row items-center justify-between gap-[20px]">
              <Line />
              <Text style={{ fontFamily: "Poppins-SemiBold" }}>OR</Text>
              <Line />
            </View>
          

          <View>
            <Text className="text-[14px]  text-center" style={{ fontFamily: "Poppins-Bold" }}>
              Are you a maintenance service providers ?{" "}
            </Text>
            <Text className="text-[14px]  text-center" style={{ fontFamily: "Poppins-Light" }}>
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
                        
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            borderRadius:10
          }}
        >
          <View className="w-[90%] flex-row items-center bg-white gap-[15px] h-[127px] rounded-3xl shadow-3xl px-[18px]">
            <View className="w-full flex-row justify-between">
              <View>
                <Location />
              </View>

              <View className="flex ">
                <Text className="text-[14px] " style={{ fontFamily: "Poppins-Bold" }}>
                  {" "}
                  Set Store Location{" "}
                </Text>
                <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>
                  We are fetching your location for the {"\n"}
                  purchase reference of our customers
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
      {user.profileCompleted && <HomeScreenUnverified />}
    </View>
    </View>
            </ScrollView>

        </View>
  );
};

export default CompleteProfile;

// const styles = StyleSheet.create({})
