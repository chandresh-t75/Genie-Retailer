import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";

import { Camera } from "expo-camera";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Send from "../../assets/SendMessage.svg";
import axios from "axios";

import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { launchCamera } from "react-native-image-picker";

import ErrorAttachment from "../../assets/ErrorAttachment.svg";
import { baseUrl } from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";
import { setUserDetails } from "../../redux/reducers/storeDataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import UnableToSendMessage from "../../components/UnableToSendMessage";

// import { setMessages } from '../../redux/reducers/requestDataSlice';

const AddProductImages = () => {
  // const [imageUri, setImageUri] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { imgUri } = route.params;
  const [camScreen, setCamScreen] = useState(true);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.storeData.userDetails);
  const accessToken = useSelector((state) => state.storeData.accessToken);
  const [openModal, setOpenModal] = useState(false);

  const addProductDetails = async () => {
    setIsLoading(true);
    const numberQuery = query?.length > 0 ? Number(query) : 0;
    const newImages = [
      { uri: imgUri, price: numberQuery,description:desc},
      ...user?.productImages,
    ];
    console.log("product images",newImages);
    try {
      // Update location on server
      const configg = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axiosInstance.patch(
        `${baseUrl}/retailer/editretailer`,
        {
          _id: user?._id,
          productImages: newImages,
        },
        configg
      );

      dispatch(setUserDetails(response.data));
      await AsyncStorage.setItem("userData", JSON.stringify(response.data));

      setIsLoading(false);
      navigation.navigate("profile");
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to update product images:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {imgUri && (
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: imgUri }}
            style={{
              // width: "100%",
              // height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              objectFit: "contain",
            }}
          />

          <View
            style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}
          >
            <KeyboardAvoidingView
              behavior={"height"}
              style={{ flexDirection: "row", gap: 1 }}
            >
              <View style={{ flexDirection: "col",width:"80%", gap: 4 }}>
              <TextInput
                placeholder="Enter product description..."
                placeholderTextColor="white"
                style={{
                  height: 64,
                  backgroundColor: "#001b33",
                  marginBottom: 0,
                  marginHorizontal: 15,
                  borderWidth: 2,
                  borderColor: "#fb8c00",
                  borderRadius: 30,
                  fontWeight: "bold",
                  paddingHorizontal: 30,
                  color: "white",
                }}
                onChangeText={(val) => {
                  setDesc(val);
                }}
                value={desc}
              />
              <TextInput
                placeholder="Enter product price (in Rs.)..."
                placeholderTextColor="white"
                keyboardType="numeric"
                style={{
                  height: 64,
                  backgroundColor: "#001b33",
                  marginBottom: 0,
                  marginHorizontal: 15,
                  borderWidth: 2,
                  borderColor: "#fb8c00",
                  borderRadius: 30,
                  fontWeight: "bold",
                  paddingHorizontal: 30,
                  color: "white",
                }}
                onChangeText={(val) => {
                  setQuery(val);
                }}
                value={query}
              />
              
              </View>
              <View className="flex-row justify-center items-center">
                <TouchableOpacity
                  onPress={() => {
                    addProductDetails();
                  }}
                  disabled={isLoading || !query  || !desc}
                >
                  {isLoading ? (
                    <View className="bg-[#fb8c00] p-[20px] rounded-full">
                      <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                  ) : (
                    <Send />
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
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
  container: {
    flex: 1,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: 30,
    gap: 5,
    marginTop: 10,
  },
  imageWrapper: {
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "gray",
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  // deleteIc: {
  //   position: 'absolute',
  //   top: 5,
  //   right: 5,
  // },
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
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 2,
  },
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent greyish background
  },
  bottomBar: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  captureButton: {
    alignSelf: "center",
    backgroundColor: "#FB8C00",
    padding: 10,
    borderRadius: 100,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default AddProductImages;
