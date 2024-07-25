import {
    View,
    Text,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
    StyleSheet,
  } from "react-native";
  import React, { useState } from "react";
  import { FontAwesome } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { TouchableOpacity } from "react-native";
  import { useDispatch, useSelector } from "react-redux";
  import { setStoreDescription, setUserDetails } from "../../redux/reducers/storeDataSlice";
  import BackArrow from "../../assets/BackArrow.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../utils/axiosInstance";
import { baseUrl } from "../utils/constants";
  
  
  
  const UpdateStoreDescription= () => {
    const navigation = useNavigation();
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);
    const user = useSelector(state => state.storeData.userDetails)
    const accessToken = useSelector((state) => state.storeData.accessToken)
  
    const storeDescription = async() => {
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
              storeDescription:query,
              
            },config
          ).then(async(response) => {
    
          console.log("store description updated successfully:", response.data); 
           dispatch(setUserDetails(response.data));
          // Update user data in AsyncStorage
          await AsyncStorage.setItem("userData", JSON.stringify(response.data));
    
          // Navigate to home only after successfully updating the location
         
          navigation.navigate("profile");
          setLoading(false)
        })
        } catch (error) {
          setLoading(false)
    
          console.error("Failed to update description:", error);
          // Optionally handle error differently here
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
                  Next
                </Text>
              </View>
            
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
 
  });
  
  export default UpdateStoreDescription;
  