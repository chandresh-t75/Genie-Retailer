import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import BackArrow from "../../assets/BackArrow.svg";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setStoreCategory, setUserDetails } from "../../redux/reducers/storeDataSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";


const searchData = [
  { id: 1, name: 'Miscelleneous' },
  { id: 2, name: 'Spare Parts' },
  { id: 3, name: 'Mobile Repair' },
  { id: 4, name: 'Electronics & Electrical Items' },
  { id: 5, name: 'Home Appliances' },
  { id: 6, name: 'Furniture' },
  { id: 7, name: 'Clothing' },
  { id: 8, name: 'Footwear' },
  { id: 9, name: 'Health & Beauty' },
  { id: 10, name: 'Books & Stationery' },
  { id: 11, name: 'Sports & Outdoors' },
  { id: 12, name: 'Groceries & Food' },
  { id: 13, name: 'Paint & Supplies' },
  { id: 14, name: 'Music & Instruments' },
  { id: 15, name: 'Jewelry & Accessories' },
  { id: 16, name: 'Others' },
];

const UpdateCategory = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(searchData);
  const user=useSelector(state=>state.storeData.userDetails)
  const [selectedOption, setSelectedOption] = useState("");
  const [loading,setLoading] =useState(false)
  const accessToken=useSelector(state=>state.storeData.accessToken)

  const handleSelectResult = (result) => {
    setSelectedOption(result === selectedOption ? "" : result);
  };

  const search = (text) => {
    const filteredResults = searchData.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleTextChange = (text) => {
    setSearchQuery(text);
    search(text);
  };

//   const handleStoreCategory = () => {
//     try {
//       dispatch(setStoreCategory(selectedOption.name));
//       navigation.navigate("serviceDelivery");
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

  const  handleStoreCategory = async () => {
    setLoading(true);

    try {
      console.log( "user", user);

      const config = {
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${accessToken}`,
        }
       }
    await axiosInstance.patch(
        `${baseUrl}/retailer/editretailer`,
        {
          _id: user._id,
          storeCategory:selectedOption.name,
          
        },config
      ).then(async(response) => {

      console.log("category updated successfully:", response.data); 
       dispatch(setUserDetails(response.data));
      // Update user data in AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(response.data));

      // Navigate to home only after successfully updating the location
     
      navigation.navigate("profile");
      setLoading(false)
    })
    } catch (error) {
      setLoading(false)

      console.error("Failed to update category:", error);
      // Optionally handle error differently here
    }
  };

  return (
    <View style={styles.container} edges={["top", "bottom"]}>
      <View className="flex-1 w-full bg-white flex-col  gap-[40px] px-[32px] ">
        <ScrollView
          className="flex-1 px-0 mb-[63px] "
          showsVerticalScrollIndicator={false}
        >
          <View className=" flex z-40 flex-row items-center mt-[20px] mb-[10px]">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
                             <BackArrow width={16} height={12} />

            </TouchableOpacity>
            <Text className="flex flex-1 justify-center  items-center text-center text-[16px] " style={{ fontFamily: "Poppins-Bold" }}>
              Select Category
            </Text>
          </View>
          <Text className="text-[14.5px] text-[#FB8C00] text-center mb-[10px] " style={{ fontFamily: "Poppins-SemiBold" }}>
            Step 4/9
          </Text>

          <View className="flex flex-row gap-2 h-[60px]  border-[1px] items-center border-[#000000] rounded-[24px] mb-[50px]">
            <Octicons name="search" size={19} className="pl-[20px]" />
            <TextInput
              placeholder="Search here......."
              placeholderTextColor="#DBCDBB"
              value={searchQuery}
              onChangeText={handleTextChange}
              className="flex  text-center text-[14px]  flex-1"
              style={{ fontFamily: "Poppins-Italic" }}
            />
          </View>
          <View className="px-[10px]">
            {searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                onPress={() => handleSelectResult(result)}
              >
                <View className="flex flex-row items-start py-[10px] gap-[24px]">
                  <View
                    className={`w-[16px] h-[16px] border-[1px] border-[#fd8c00] items-center ${
                      result.id === selectedOption.id ? "bg-[#fd8c00]" : ""
                    }`}
                  >
                    {result.id === selectedOption.id && (
                      <Octicons name="check" size={12} color="white" />
                    )}
                  </View>
                  <Text style={{ fontFamily: "Poppins-Regular" }}>{result.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: !selectedOption ? "#e6e6e6" : "#FB8C00",
            height: 63,
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={!selectedOption}
          onPress={handleStoreCategory}
        >
          <View style={styles.nextButtonInner}>
            <Text
              style={{
                color: !selectedOption ? "#888888" : "white",
                fontSize: 18,
                fontFamily:"Poppins-Black"
              }}
            >
              NEXT
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fb8c00" />
          </View>
        )}
    </View>
  );
};

const styles = {
    loadingContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
  container: {
    flex: 1,
    //  marginTop: Platform.OS === 'android' ? 44 : 0,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding:15,
    zIndex:100
  
  
  },

  nextButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 63,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
};

export default UpdateCategory;
