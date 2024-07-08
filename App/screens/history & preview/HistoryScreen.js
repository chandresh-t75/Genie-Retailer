import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Profile from "../../assets/ProfileIcon.svg";
import GinieIcon from "../../assets/GinieBusinessIcon.svg";
import History from "../../assets/HistoryIcon.svg";
import Close from "../../assets/Cross.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  setCurrentRequest,
  setRequestInfo,
} from "../../redux/reducers/requestDataSlice";
import ProductOrderCard from "../../components/ProductOrderCard";
import { useDispatch, useSelector } from "react-redux";
import BackArrow from "../../assets/BackArrow.svg";



const HistoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const retailerHistory = useSelector(
    (state) => state.requestData.retailerHistory || []
  );
  const [tab, setTab] = useState("Cancelled");
  const [cancelledRequests, setCancelledRequests] = useState([]);
  const [closedRequests, setClosedRequests] = useState([]);

  useEffect(() => {
    const cancel = [];
    const closed = [];

    retailerHistory?.forEach((request) => {
      if (request?.requestType === "cancelled") {
        cancel.push(request);
      } else if (request?.requestType === "closed") {
        closed.push(request);
      }
    });

    setCancelledRequests(cancel);
    setClosedRequests(closed);
  }, [retailerHistory]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex flex-row z-40 justify-center items-center px-[32px] ">
        <TouchableOpacity onPress={() => {navigation.goBack()}} 
                     style={{
                      position:"absolute",
                      left:10,
                      top:-6,
                      zIndex:40,
                      padding:20,

                     }}>
                     <View className="p-4 rounded-full ">
                       <BackArrow />
                    </View>
                     </TouchableOpacity>
          {/* <View className="bg-[#FB8C00] p-[4px] rounded-full">
            <TouchableOpacity onPress={() => navigation.navigate("menu")}>
              <Profile />
            </TouchableOpacity>
          </View> */}
          {/* <GinieIcon />
          <View className=" absolute z-40 p-[20px] rounded-full right-0">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingRight: 20 }}
            >
              <Close />
            </TouchableOpacity>
          </View> */}
        </View>
        <Text
          className="text-[16px] text-center mt-[20px] mb-[40px] "
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Your History
        </Text>
        <View className="flex-1">
          <View className="flex-row justify-around px-[10px]   gap-[5x] mb-[20px]">
            <TouchableOpacity onPress={() => setTab("Cancelled")}>
              <View className="flex-row  gap-[5px]   p-[4px]">
                <Text
                  style={{
                    fontFamily:
                      tab === "Cancelled" ? "Poppins-Bold" : "Poppins-Regular",
                    borderBottomWidth: tab === "Cancelled" ? 3 : 0,
                    borderBottomColor: "#FB8C00",
                  }}
                  className=""
                >
                  Cancelled Requests
                </Text>
               
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab("Closed")}>
              <View className="flex-row gap-[5px]  p-[4px]">
                <Text
                  style={{
                    fontFamily:
                      tab === "Closed" ? "Poppins-Bold" : "Poppins-Regular",

                    borderBottomWidth: tab === "Closed" ? 3 : 0,
                    borderBottomColor: "#FB8C00",
                  }}
                >
                  Closed Requests
                </Text>
                
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-col gap-[10px] mb-[20px] items-center justify-center">
            {tab === "Cancelled" &&
              (cancelledRequests && cancelledRequests.length > 0 ? (
                cancelledRequests.map((product) => (
                  <TouchableOpacity
                    key={product._id}
                    onPress={() => {
                      dispatch(setRequestInfo(product));
                      const req = {
                        requestId:product?._id,
                        userId: product?.users[0]._id,
                      };
                      console.log("request details", req);
                      const requestId = req?.requestId;
                      dispatch(setCurrentRequest(req));
                      setTimeout(() => {
                        navigation.navigate(`requestPage${requestId}`);
                      }, 200);
                    }}
                    style={{
                      backgroundColor: "#fff", // Ensure the background is white
                      margin: 10, // Add some margin if necessary for better shadow visibility
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 5,
                      borderRadius: 16,
                    }}
                  >
                    <ProductOrderCard key={product._id} product={product} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text
                  className="text-[14px] text-center mb-[20px]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  No Cancelled History
                </Text>
              ))}

            {tab === "Closed" &&
              (closedRequests && closedRequests.length > 0 ? (
                closedRequests.map((product) => (
                  <TouchableOpacity
                    key={product._id}
                    onPress={() => {
                      dispatch(setRequestInfo(product));
                      const req = {
                        requestId: product?._id,
                        userId: product?.users[0]._id,
                      };
                      console.log("request details", req);
                      const requestId = req?.requestId;
                      dispatch(setCurrentRequest(req));
                      setTimeout(() => {
                        navigation.navigate(`requestPage${requestId}`);
                      }, 200);
                    }}
                    style={{
                      backgroundColor: "#fff", // Ensure the background is white
                      margin: 10, // Add some margin if necessary for better shadow visibility
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 5,
                      borderRadius: 16,
                    }}
                  >
                    <ProductOrderCard key={product._id} product={product} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text
                  className="text-[14px] text-center mb-[20px]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  No Closed History
                </Text>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({});
