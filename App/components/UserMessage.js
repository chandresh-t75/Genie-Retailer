import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import Tick from "../assets/tick.svg";
import DPIcon from "../assets/DPIcon.svg";
import { useSelector } from "react-redux";
import {
  formatDateTime,
  handleDownload,
  handleDownloadPress,
} from "../screens/utils/lib";
import * as FileSystem from "expo-file-system";
import { Feather } from "@expo/vector-icons";
// import * as MediaLibrary from "expo-media-library";

const UserMessage = ({ bidDetails }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const [downloadProgress, setDownloadProgress] = useState({});

  const handleImagePress = (image) => {
    setSelectedImage(image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
    setDownloadProgress({});
  };
  // console.log("bidDetails", bidDetails);
  const { formattedTime, formattedDate } = formatDateTime(
    bidDetails?.updatedAt
  );
  const interpolateColor = (progress) => {
    const greenValue = Math.round(progress * 180);
    return `rgb(0, ${greenValue}, 0)`;
  };

  // const userDetails = useSelector(store => store.user.userDetails);
  const requestInfo = useSelector(
    (state) => state.requestData.requestInfo || {}
  );

  return (
    <View className="flex gap-[19px]    rounded-3xl w-[297px] h-[max-content] py-[10px] items-center bg-[#fafafa]">
      <View className="flex-row gap-[18px] ">
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
        <View className="w-[60%]">
          <View className="w-full flex  flex-row justify-between">
            <Text
              className="w-[70%] text-[14px] flex flex-wrap flex-row text-[#2e2c43] capitalize"
              style={{ fontFamily: "Poppins-ExtraBold" }}
            >
              {requestInfo?.customerId?.userName}
            </Text>

            <Text
              className="text-[12px] text-[#2e2c43] "
              style={{ fontFamily: "Poppins-Regular" }}
            >
              {formattedTime}
            </Text>
          </View>
          <Text
            className="text-[14px] text-[#2e2c43]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            {bidDetails.message}
          </Text>
        </View>
      </View>

      {bidDetails?.bidImages?.length > 0 && (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            gap: 4,
            paddingHorizontal: 25,
          }}
        >
          {bidDetails?.bidImages.map((image, index) => (
            <View
              key={index}
              style={{ position: "relative", width: 96, height: 132 }}
            >
              <Pressable onPress={() => handleImagePress(image)}>
                <Image
                  source={{ uri: image }}
                  style={{ height: 132, width: 96, borderRadius: 20 }}
                />
              </Pressable>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: "gray",
                  padding: 2,
                  borderRadius: 100,
                }}
                onPress={() =>
                  handleDownloadPress(
                    image,
                    index,
                    downloadProgress,
                    setDownloadProgress
                  )
                }
              >
                <Feather name="download" size={18} color="white" />
              </TouchableOpacity>
              {downloadProgress[index] !== undefined && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {Math.round(downloadProgress[index] * 100)}%
                  </Text>
                </View>
              )}
            </View>
          ))}
          <Modal
            transparent
            visible={!!selectedImage}
            onRequestClose={handleClose}
            downloadProgress={downloadProgress}
            setDownloadProgress={setDownloadProgress}
          >
            <Pressable style={styles.modalContainer} onPress={handleClose}>
              <Animated.Image
                source={{ uri: selectedImage }}
                style={[
                  styles.modalImage,
                  {
                    transform: [{ scale: scaleAnimation }],
                  },
                ]}
              />
              <TouchableOpacity
                style={{
                  width: 300,
                  backgroundColor: "#fb8c00",
                  height: 50,
                  borderRadius: 100,
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={downloadProgress[1] !== undefined}
                onPress={() =>
                  handleDownload(
                    selectedImage,
                    downloadProgress,
                    setDownloadProgress
                  )
                }
              >
                {downloadProgress[1] !== undefined && (
                  <View
                    style={[
                      styles.progress,
                      {
                        backgroundColor: interpolateColor(downloadProgress[1]),
                      },
                    ]}
                  >
                    <Text style={styles.progresstext}>
                      {downloadProgress[1] !== 1
                        ? `${Math.round(downloadProgress[1] * 100)}%`
                        : "Downloaded"}
                    </Text>
                  </View>
                )}

                {!downloadProgress[1] && (
                  <View className="w-full flex flex-row  gap-[20px]  justify-center items-center">
                    <Text
                      className="text-white text-[16px]"
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      Download
                    </Text>
                    <Feather name="download" size={18} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </Pressable>
          </Modal>
        </ScrollView>
      )}
      {bidDetails?.bidPrice > 0 && (
        <View className="flex-row gap-[5px]">
          <Text style={{ fontFamily: "Poppins-Medium" }}>Expected Price: </Text>
          <Text
            className="font-bold text-[#79B649]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Rs. {bidDetails.bidPrice}
          </Text>
        </View>
      )}

      {/* <View className="gap-[4px]">
                <View className="flex-row gap-[5px]">
                    <Text>Expected Price: </Text>
                    <Text className="font-bold text-[##79B649]">Rs. {bidDetails.bidPrice}</Text>


                </View>

                {bidDetails?.bidAccepted === "rejected" && (
                    <View className="flex-row items-center gap-1">
                        <Entypo name="circle-with-cross" size={20} color="#E76063" />
                        <Text className="text-[14px] text-[#E76063]">
                            Bid Rejected
                        </Text>
                    </View>
                )}
                {bidDetails?.bidAccepted === "accepted" && (
                    <View className="flex-row items-center gap-1">
                        <Tick width={18} height={18} />
                        <Text className="text-[14px] text-[#79B649]">
                            Bid Accepted
                        </Text>
                    </View>
                )}



            </View> */}
    </View>
  );
};

export default UserMessage;

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
