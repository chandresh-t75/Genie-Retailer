import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import BackArrow from "../../assets/BackArrow.svg";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setStoreCategory } from "../../redux/reducers/storeDataSlice";

const searchData = [
  { id: 1, name: 'Miscelleneous' },
  { id: 2, name: 'Fashion/clothings-Top, bottom, dresses'},
  { id: 3, name: 'Tailor - Makes or alters clothing' },
  { id: 4, name: 'Drycleaning & Laundry - Clothes and accessories' },
  { id: 5, name: 'Fashion accessories - Shoes, begs etc' },
  { id: 6, name: 'Fashion accessories - Eyewear etc' },
  { id: 7, name: 'Fashion accessories - Jewelry, Gold & Diamond' },
  { id: 8, name: 'Grocery & Kirana' },
  { id: 9, name: 'Automotive parts/Services - 2 wheeler Fuel based' },
  { id: 10, name: 'Automotive parts/Services - 4 wheeler Fuel based' },
  { id: 11, name: 'Automotive parts/Services - 2-wheeler EV' },
  { id: 12, name: 'Automotive parts/Services - 4-wheeler EV' },
  { id: 13, name: 'Automotive parts/ service- 3-wheeler, commercial vehicles & EV' },
  { id: 14, name: 'Consumer Electronics Services & Accessories - Mobile, Laptop, digital products etc' },
  { id: 15, name: 'Consumer Electronics Services & accessories - Home appliances and   equipment etc' },
  { id: 16, name: 'Consumer Electronics & Accessories - Mobile, Laptop, digital products etc' },
  { id: 17, name: 'Consumer Electronics & accessories - Home appliances and equipment etc' },
  { id: 18, name: 'Electrical hardware & accessories - Inverter, batteries, Solar etc' },
  { id: 19, name: 'Electrical hardware & accessories- Wiring, equipments, lights etc' },
  { id: 20, name: 'Electrical services - Electrician' },
  { id: 21, name: 'Fashion accessories - Jewelry, Gold & Diamond' },
  { id: 22, name: 'Electrical equipment services- Ac, Fridge, Cooler repair etc' },
  { id: 23, name: 'Sports accessories & Services - Cricket, Football, Basketball etc' },
  { id: 24, name: 'Sports Nutrition - Whey Pro etc' },
  { id: 25, name: 'Home furnishing - furniture etc' },
  { id: 26, name: 'Home furnishing - Blanket, Pillow, Curtains etc ' },
  { id: 27, name: 'Carpanter service - Repair' },
  { id: 28, name: 'Kitchen Utensils and Kitchenware' },
  { id: 29, name: 'Hardware - Cement, Hand tools, Powertools etc' },
  { id: 30, name: 'Plants & Gardening Accessories' },
  { id: 31, name: 'Gardening Services' },
  { id: 32, name: 'Pet care & food' },
  { id: 33, name: 'Medical store & Healthcare' },
  { id: 34, name: 'Clock repair & services' },
  { id: 35, name: 'Luxury watches' },
  { id: 36, name: 'Toys and kids games' },
  { id: 37, name: 'Paintings & Art' },
 
];

const SearchCategoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(searchData);

  const [selectedOption, setSelectedOption] = useState("");

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

  const handleStoreCategory = () => {
    try {
      dispatch(setStoreCategory(selectedOption.name));
      navigation.navigate("serviceDelivery");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={styles.container} edges={["top", "bottom"]}>
      <View className="flex-1 w-full bg-white flex-col  gap-[40px] px-[32px] ">
        <ScrollView
          className="flex-1 px-0 mb-[63px]"
          showsVerticalScrollIndicator={false}
        >
          <View className=" flex z-40 flex-row items-center mt-[30px] mb-[10px]">
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
            Step 4/6
          </Text>

          <View className="flex flex-row h-[60px]  border-[1px] items-center border-[#000000] border-opacity-25 rounded-[24px] mb-[50px] bg-white" >
            <Octicons name="search" size={19} className="pl-[20px] absolute" />
            <TextInput
              placeholder="Search here...."
              placeholderTextColor="#DBCDBB"
              value={searchQuery}
              onChangeText={handleTextChange}
              className="flex  text-center text-[14px] justify-center items-center  flex-1 px-[10px]"
              style={{ fontFamily: "Poppins-Italic" }}
              
            />
          </View>
          <View className="px-[10px]">
            {searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                onPress={() => handleSelectResult(result)}
              >
                <View className="flex flex-row  items-center py-[20px] gap-[20px]">
                  <View
                    className={`w-[16px] h-[16px] border-[1px] border-[#fd8c00] items-center ${
                      result.id === selectedOption.id ? "bg-[#fd8c00]" : ""
                    }`}
                  >
                    {result.id === selectedOption.id && (
                      <Octicons name="check" size={12} color="white" />
                    )}
                  </View>
                  <Text style={{ fontFamily: "Poppins-Regular" }} className="text-[16px] flex w-[90%]">{result.name}</Text>
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
    </View>
  );
};

const styles = {
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

export default SearchCategoryScreen;
