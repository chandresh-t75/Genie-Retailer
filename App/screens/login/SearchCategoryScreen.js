import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import BackArrow from "../../assets/BackArrow.svg";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setStoreCategory } from "../../redux/reducers/storeDataSlice";
import { baseUrl } from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import NetworkError from "../../components/NetworkError";

// const searchData = [
  
//   { id: 1, title: 'Automotive parts/Services', subTitle: '2 wheeler Fuel based' },
//   { id: 2, title: 'Automotive parts/Services', subTitle: '2-wheeler EV' },
//   { id: 3, title: 'Automotive parts/Services', subTitle: '4 wheeler Fuel based' },
//   { id: 4, title: 'Automotive parts/Services', subTitle: '4-wheeler EV' },
//   { id: 5, title: 'Automotive parts/service', subTitle: '3-wheeler, commercial vehicles & EV' },
//   { id: 6, title: 'Carpenter service', subTitle: 'Repair' },
//   { id: 7, title: 'Clock repair & services', subTitle: '' },
//   { id: 8, title: 'Consumer Electronics Services & Accessories', subTitle: 'Mobile, Laptop, digital products etc' },
//   { id: 9, title: 'Consumer Electronics Services & Accessories', subTitle: 'Home appliances and equipment etc' },
//   { id: 10, title: 'Consumer Electronics & Accessories', subTitle: 'Mobile, Laptop, digital products etc' },
//   { id: 11, title: 'Consumer Electronics & Accessories', subTitle: 'Home appliances and equipment etc' },
//   { id: 12, title: 'Drycleaning & Laundry', subTitle: 'Clothes and accessories' },
//   { id: 13, title: 'Electrical hardware & accessories', subTitle: 'Inverter, batteries, Solar etc' },
//   { id: 14, title: 'Electrical hardware & accessories', subTitle: 'Wiring, equipment, lights etc' },
//   { id: 15, title: 'Electrical equipment services', subTitle: 'Ac, Fridge, Cooler repair etc' },
//   { id: 16, title: 'Electrical services', subTitle: 'Electrician' },
//   { id: 17, title: 'Fashion/clothings', subTitle: 'Top, bottom, dresses' },
//   { id: 18, title: 'Fashion accessories', subTitle: 'Shoes, bags etc' },
//   { id: 19, title: 'Fashion accessories', subTitle: 'Eyewear etc' },
//   { id: 20, title: 'Fashion accessories', subTitle: 'Jewelry, Gold & Diamond' },
//   { id: 21, title: 'Fashion accessories', subTitle: 'Jewelry, Gold & Diamond' },
//   { id: 22, title: 'Grocery & Kirana', subTitle: '' },
//   { id: 23, title: 'Gardening Services', subTitle: '' },
//   { id: 24, title: 'Plants & Gardening Accessories', subTitle: '' },
//   { id: 25, title: 'Hardware', subTitle: 'Cement, Hand tools, Powertools etc' },
//   { id: 26, title: 'Home & function decoration', subTitle: '' },
//   { id: 27, title: 'Home furnishing', subTitle: 'furniture etc' },
//   { id: 28, title: 'Home furnishing', subTitle: 'Blanket, Pillow, Curtains etc' },
//   { id: 29, title: 'Home furnishing', subTitle: 'Blanket, Pillow, Curtains etc' },
//   { id: 30, title: 'Kitchen Utensils & Kitchenware', subTitle: '' },
//   { id: 31, title: 'Luxury watches', subTitle: '' },
//   { id: 32, title: 'Medical store & Healthcare', subTitle: '' },
//   { id: 33, title: 'Pet care & food', subTitle: '' },
//   { id: 34, title: 'Paintings & Art', subTitle: '' },
//   { id: 35, title: 'Sports Nutrition', subTitle: 'Whey Pro etc' },
//   { id: 36, title: 'Sports accessories & Services', subTitle: 'Cricket, Football, Basketball etc' },
//   { id: 37, title: 'KIds games,toys & clothings', subTitle: '' },
//   { id: 38, title: 'Tailor', subTitle: 'Makes or alters clothing'},
// ];


const SearchCategoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(searchData);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [searchData,setSearchData] = useState([])
  const [networkError, setNetworkError] = useState(false);


  const handleSelectResult = (result) => {
    setSelectedOption(result === selectedOption ? "" : result);
  };

  const search = (text) => {
    const filteredResults = searchData.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase()) ||
      item.subTitle.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filteredResults);
    // console.log(filteredResults);
  };
  

  useEffect(()=>{
    // if(isFocused) {
     SearchCategories();
    }, [])
  
  const SearchCategories = async () => {
    setIsLoading(true);
    try {
      // Make a request to your backend API to check if the mobile number is registered

      const response = await axios.get(
        `${baseUrl}/retailer/available-categories`,
       
      );
      console.log("res", response.data);
      if(response.data){
        setSearchData(response.data);
        setSearchResults(response.data);
      }
    } catch (error) {
      
      console.error("Error finding categories:", error);
      if (!error?.response?.status){
        // console.log("hii net")
          setNetworkError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text) => {
    setSearchQuery(text);
    search(text);
  };

  const handleStoreCategory = () => {
    try {
      const category = selectedOption.subTitle
        ? `${selectedOption.title} - ${selectedOption.subTitle}`
        : selectedOption.title;
      dispatch(setStoreCategory(category.trim()));
      console.log(category);
      navigation.navigate("serviceDelivery");
    } catch (error) {
      console.log("error", error);
    }
  };
  

  return (
    <View style={styles.container} edges={["top", "bottom"]}>
      <View className=" flex-1 w-full bg-white flex-col gap-[40px] px-[32px]">
       <ScrollView
          className="flex-1 px-0 mb-[63px]"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex z-40 flex-row items-center mt-[30px] mb-[10px]">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <BackArrow width={16} height={12} />
            </TouchableOpacity>
            <Text
              className="flex flex-1 justify-center items-center text-center text-[#2E2C43] text-[16px]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Select Category
            </Text>
          </View>
          <Text
            className="text-[14.5px] text-[#FB8C00] text-center mb-[10px]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Step 4/6
          </Text>


  <View className="flex flex-row h-[60px] border-[1px] items-center border-[#000000] border-opacity-25 rounded-[24px] mb-[50px] bg-white">
  <Octicons name="search" size={19} style={{paddingLeft: 20, position: 'absolute', left: 0 }} />
  <TextInput
    placeholder="Search here...."
    placeholderTextColor="#DBCDBB"
    value={searchQuery}
    onChangeText={handleTextChange}
    className="flex text-center text-[14px] text-[#2E2C43] justify-center items-center flex-1 px-[40px]" // Adjusted padding to center the text
    style={{ fontFamily: "Poppins-Italic", textAlign: 'center' }} // Added textAlign for centering text
  />
</View>

          <View className="px-[10px]">
            {!isLoading && searchResults && searchResults?.map((result) => (
              <TouchableOpacity
                key={result.id}
                onPress={() => handleSelectResult(result)}
              >
                <View className="flex flex-row items-center py-[20px] gap-[20px]">
                  <View
                    className={`w-[16px] h-[16px] border-[1px] border-[#fd8c00] items-center ${
                      result.id === selectedOption.id ? "bg-[#fd8c00]" : ""
                    }`}
                  >
                    {result.id === selectedOption.id && (
                      <Octicons name="check" size={12} color="white" />
                    )}
                  </View>
                  <View className="flex flex-col w-[90%]">
                    <Text
                      style={{ fontFamily: "Poppins-Bold" }}
                      className="text-[16px] text-[#2E2C43]"
                    >
                      {result.title}
                    </Text>
                    {result.subTitle ? (
                      <Text
                        style={{ fontFamily: "Poppins-Regular" }}
                        className="text-[14px] text-[#2E2C43]"
                      >
                        {result.subTitle}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
{networkError && <View style={{ justifyContent:"center" ,alignItems:"center", zIndex: 120}}><NetworkError callFunction={SearchCategories} setNetworkError={setNetworkError} /></View>}



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
                fontFamily: "Poppins-Black",
              }}
            >
              Next
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
      )}

    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 15,
    zIndex: 100,
  },
  nextButtonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export default SearchCategoryScreen;
