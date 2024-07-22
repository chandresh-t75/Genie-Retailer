import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import LocationImg from "../../assets/LocationImg";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ModalScreen from "../../components/ModalScreen";
import ModalScreenConfirm from "../../components/ModalScreenConfirm";
import { useDispatch, useSelector } from "react-redux";
import { setServiceProvider, setStoreLocation, setUserDetails } from "../../redux/reducers/storeDataSlice";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackArrow from "../../assets/BackArrow.svg";

import ModalUpdateLocationConfirm from "../../components/ModalUpdateLocationConfirm";
import { baseUrl } from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";



const UpdateLocation = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [storeLocation, setStoreLocationLocal] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const route = useRoute();
  const user = useSelector(state => state.storeData.userDetails)


  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [loc, setLoc] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const { width } = Dimensions.get("window");
  const accessToken = useSelector((state) => state.storeData.accessToken)





  useEffect(() => {
    handleRefreshLocation();
  }, []);

  const getLocationName = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      // console.log("location", data);
      if (!data.error) {
        // return data.display_name;
        setAddress(data?.display_name.split(" ").slice(0, 5).join(" "));
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };

  const fetchLocation = async () => {

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({


        accuracy: Location.Accuracy.Lowest, // Increase accuracy level
        timeInterval: 5000, // Set time interval to 5 seconds
        distanceInterval: 0.1,
      });
      console.log(location);
      const { latitude, longitude } = location.coords;
      setLatitude(Number(latitude)); // Ensure values are stored as numbers
      setLongitude(Number(longitude));

      setStoreLocationLocal(latitude + "," + longitude);

      setLoc({ latitude, longitude });

      await getLocationName(latitude, longitude);



      // }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleRefreshLocation = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < 3; i++) {
        try {
          console.log("Refreshing location", i)
          await fetchLocation();


        } catch (error) {
          console.error(`Attempt ${i + 1} failed:`, error);
          if (i === retries - 1) {
            throw error;
          }
        }
      }

    } catch (error) {
      console.error(`location failed:`, error);

    } finally {
      setLoading(false);
    }

  };

  const handleLocation = (storeLocation) => {
    // Update the mobile number state
    setStoreLocationLocal(storeLocation);
    // Log the mobile number value
    console.log(storeLocation);
  };
  const handleLocationChange = (location) => {
    // Update the mobile number state
    setLocation(location);
    // Log the mobile number value
    console.log(location);
  };

  const handleLocationFetching = async () => {
    setLoading(true);

    try {
      console.log("Location:", storeLocation, "user", user);

      // Update location in Redux store
      dispatch(setStoreLocation(location));
      // Update location on server
      const config = {
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${accessToken}`,
        }
       }
      const response = await axiosInstance.patch(
        `${baseUrl}/retailer/editretailer`,
        {
          _id: user?._id,
          location: location,
          lattitude: latitude,
          longitude: longitude,
          coords: {
            type: "Point",
            coordinates: [longitude, latitude]
          }
        },config
      );

      console.log("Location updated successfully:", response.data);
      dispatch(setUserDetails(response.data));
      // Update user data in AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(response.data));

      // Navigate to home only after successfully updating the location


      navigation.navigate("profile");
      setLoading(false);
    } catch (error) {
      console.error("Failed to update location:", error);
      // Optionally handle error differently here
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>


      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView >
          <View style={{ flex: 1, backgroundColor: "white", position: "relative", paddingBottom: 80 }} >
          <View className="w-full z-40 absolute px-[32px]  mt-[20px] flex flex-row justify-between items-center">
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{ padding: 20, paddingRight: 20, zIndex: 30}}
              >
                <BackArrow />
              </TouchableOpacity>
            </View>
            <View className="flex flex-col justify-center items-center px-[32px] mt-[20px] ">
              <LocationImg height={322} width={width} />
            </View>


            <View className="mt-[40px] mb-[45px] flex flex-col gap-[33px] px-[32px]">
              <View>
                <Text className="text-[18px] text-[#001B33] " style={{ fontFamily: "Poppins-Black" }}>
                  Please confirm your {"\n"}store location
                </Text>
                <Text className="text-[14px] text-[#2e2c43] mt-[36px]" style={{ fontFamily: "Poppins-Regular" }}>
                  Fetched Location
                </Text>

                <View style={styles.container}>
                  <TextInput
                    placeholder="189/2, Out Side Datia Gate ,Jhansi, 28402"
                    placeholderTextColor="#dbcdbb"
                    value={address}
                    onChangeText={handleLocation}
                    editable={false} // if you want to make it read-only
                    multiline={true}
                    scrollEnabled={true}
                    style={styles.input}
                  />
                </View>

                <View className="flex items-start mt-[10px] pb-[10px]">
                  <Pressable onPress={handleRefreshLocation} className="w-max">
                    <Text className="text-[#E76063] text-[14px] " style={{ fontFamily: "Poppins-Regular" }}>
                      Refresh
                    </Text>
                  </Pressable>
                </View>

                <Text className="text-[14px] text-[#2e2c43] mt-[10px]" style={{ fontFamily: "Poppins-Regular" }}>
                  Type your store address
                </Text>

                <View className="flex  items-center">
                  <TextInput
                    placeholder="189/2,  Out Side Datia Gate ,Jhansi, 28402"
                    placeholderTextColor={"#dbcdbb"}
                    value={location}
                    onChangeText={handleLocationChange}
                    className="w-[330px] overflow-x-scroll  text-[14px]  px-[20px] py-[15px] bg-[#F9F9F9]  text-black rounded-[16px]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  />

                </View>


              </View>
            </View>

          </View>
        </KeyboardAvoidingView>

      </ScrollView>


      <TouchableOpacity
        disabled={!location}
        onPress={handleLocationFetching}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 68,
          width: "100%",
          backgroundColor:
            !location ? "#e6e6e6" : "#FB8C00",
          justifyContent: "center", // Center content vertically
          alignItems: "center", // Center content horizontally
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins-Black",
            color: !location ? "#888888" : "white",
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>

      <View className="absolute flex justify-center items-center">
        <ModalScreen
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setModalConfirmVisible={setModalConfirmVisible}
        />
        <ModalUpdateLocationConfirm
          modalConfirmVisible={modalConfirmVisible}
          setModalConfirmVisible={setModalConfirmVisible}
        />
      </View>

      {(modalVisible || modalConfirmVisible) && (
        <View style={styles.overlay} />
      )}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    width: 330,
    textAlignVertical: 'top', // Align text to the top
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F9F9F9',
    fontFamily: "Poppins-Regular",
    color: 'black',
    borderRadius: 16,
    height: "max-content", // Adj
  },
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent greyish background
  },
});

export default UpdateLocation;
