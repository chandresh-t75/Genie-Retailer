import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  Modal,
  Pressable,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import Tick from "../assets/tick.svg";
import DPIcon from "../assets/DPIcon.svg";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDateTime } from "../screens/utils/lib";
import RightArrow from "../assets/arrow-right.svg";
import * as Location from "expo-location";



const LocationMessage = ({ bidDetails }) => {
  // console.log("bidDetails", bidDetails);
  const { formattedTime, formattedDate } = formatDateTime(
    bidDetails?.updatedAt
  );
  const user = useSelector((state) => state.storeData.userDetails);

  const requestInfo = useSelector(
    (state) => state.requestData.requestInfo || {}
  );

  const handleOpenGoogleMaps = async () => {
    // Request permission to access location
    console.log("location");
    const customerLocation = {
        lattitude:bidDetails.latitude,
        longitude:bidDetails.longitude
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
    }

    // Get current location
    // console.log("storelocation", storeLocation);
    // console.log('userLocation while map opening', userLongitude, userLatitude);
 
        // setCurrentLocation({
        //     latitude: location.coords.latitude,
        //     longitude: location.coords.longitude,
        // });
        // console.log('location details of user at bargaining', location);
    

    console.log(
        "current and store location",
        user.lattitude,
        user.longitude,
        customerLocation
    );

    // if (userLongitude === 0 || userLatitude === 0 || !storeLocation) {
    //     Alert.alert('Error', 'Current location or friend location is not available.');
    //     return;
    // }
    
        const url = `https://www.google.com/maps/dir/?api=1&origin=${user?.lattitude},${user?.longitude}&destination=${customerLocation.lattitude},${customerLocation.longitude}&travelmode=driving`;

        Linking.openURL(url).catch((err) =>
            console.error("An error occurred", err)
        );
    
};

  return (
    <View className="flex gap-[19px]   rounded-3xl w-[297px]  py-[20px] items-center bg-[#fafafa]">
       <View className="flex-row gap-[18px]">
        
          <View>
            {requestInfo?.customerId?.pic ? (
              <Image
                source={{ uri: requestInfo?.customerId?.pic }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                // className="w-[40px] h-[40px] rounded-full"
              />
            ) : (
              <Image
                source={{
                  uri: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
                }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                // className="w-[40px] h-[40px] rounded-full"
              />
            )}
        
        </View>
        <View className="w-[60%] flex-col gap-2">
          <View className="w-full flex  flex-row justify-between">
            <Text
              className="w-[70%] text-[14px] flex flex-wrap flex-row  capitalize"
              style={{ fontFamily: "Poppins-ExtraBold" }}
            >
              {requestInfo?.customerId?.userName}
            </Text>

            <Text
              className="text-[12px] text-[#263238] "
              style={{ fontFamily: "Poppins-Regular" }}
            >
              {formattedTime}
            </Text>
          </View>

          <Text
            className="text-[#263238] text-[14px]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
           Customer sent you the delivery location.
          </Text>
     
            <View className="flex-row gap-1 items-center">
              <Ionicons name="location-outline" size={26} color="black" />
              <Text
                className=" overflow-hidden text-[#001b33] text-[12px]"
                style={{ fontFamily: "Poppins-Regular" }}
              >{bidDetails?.message.length > 45 ? `${bidDetails?.message.slice(0, 45)}..` : bidDetails.message}.</Text>
            </View>
            
            <TouchableOpacity onPress={()=>{handleOpenGoogleMaps() }} className="flex-row  items-center gap-[5px]" style={{
                flexDirection:"row",
                alignItems: "center",
                gap:6
                }}>
             
              <Text
                className="text-[14px] text-[#fb8c00]"
                style={{ fontFamily: "Poppins-Bold",paddingVertical:4 }}
              >
                Go to the map
              </Text>
              <RightArrow width={15} />
            </TouchableOpacity>
       
        </View>
      </View>
    </View>
  );
};

export default LocationMessage;

const styles = StyleSheet.create({
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
  progressContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  progress: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 50,
  },
  progressText: {
    color: "white",
    fontSize: 16,
  },
  progresstext: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    width: "100%",
    textAlign: "center",
  },
});
