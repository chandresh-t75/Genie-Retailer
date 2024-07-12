import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { setStoreDescription } from "../../redux/reducers/storeDataSlice";
import BackArrow from "../../assets/BackArrow.svg";



const WriteAboutStoreScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const storeDescription = () => {
    try {
      dispatch(setStoreDescription(query));
      navigation.navigate("addImg");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-white">
      <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{padding:24,paddingTop:36,position:"absolute",zIndex:100}}
            >
                             <BackArrow  />

            </TouchableOpacity>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 12,
              marginTop: 30,
            }}
          >
            
            <Text style={{ flex: 1, textAlign: "center", fontSize: 16,fontFamily:"Poppins-Bold" }} className="text-[#2e2c43]">
            Tell us about your store {"\n"}
            & services
            </Text>
          </View>

          <View style={{ paddingHorizontal: 32, marginTop: 10 }}>
          <Text className="text-[14.5px]  text-[#FB8C00] text-center mb-[10px]" style={{ fontFamily: "Poppins-SemiBold" }}>
                    Step 1/4
                  </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#2e2c43",
                textAlign: "center",
                marginBottom: 29,
                fontFamily:"Poppins-Regular"
              }}
              className="text-[#2e2c43]"
            >
              What do you sell, or what services {"\n"}do you provide?
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: 20,
              height: 127,
              backgroundColor: "#f9f9f9",
              borderRadius: 20,
            }}
          >
            <TextInput
              multiline
              numberOfLines={6}
              onChangeText={(val) => {
                setQuery(val);
              }}
              value={query}
              placeholder="Type about your store......"
              placeholderTextColor="#DBCDBB"
              style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingVertical: 10,
                // borderWidth: 0.3,
                // borderColor: "gray",
                
                borderRadius: 20,
                fontFamily:"Poppins-Regular",
              }}
              className="border-gray-400 border-[1px] border-opacity-25"
            />
          </View>
        </View>

        <TouchableOpacity  disabled={!query} onPress={storeDescription}>
          
            <View
              style={{
                height: 63,
                backgroundColor:
                !query? "#e6e6e6" : "#FB8C00",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{  color: !query ? "#888888" : "white", fontSize: 18, fontFamily:"Poppins-Black"}}
              >
                NEXT
              </Text>
            </View>
          
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default WriteAboutStoreScreen;
