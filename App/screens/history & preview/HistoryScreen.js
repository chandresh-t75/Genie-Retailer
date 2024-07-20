import {
  Modal,
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
import DropDown from "../../assets/dropDown.svg";
import DropDownUp from "../../assets/dropDownUp.svg";

const HistoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const retailerHistory = useSelector(
    (state) => state.requestData.retailerHistory || []
  );
  const [tab, setTab] = useState("All");
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [closedRequests, setClosedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (tab) => {
    setTab(tab);
    setDropdownVisible(false);
  };
  useEffect(() => {
    const rejected = [];
    const closed = [];
    const completed = [];

    retailerHistory?.forEach((request) => {
      if (request?.requestType === "rejected") {
        rejected.push(request);
      } else if (request?.requestType === "completed") {
        completed.push(request);
      } else {
        closed.push(request);
      }
    });

    setRejectedRequests(rejected);
    setClosedRequests(closed);
    setCompletedRequests(completed);
  }, [retailerHistory]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ zIndex: 100 }}>
        <View className="flex flex-row z-40 justify-center items-center px-[32px] " style={{}}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              position: "absolute",
              left: 10,
              top: 12,
              zIndex: 40,
              padding: 20,
            }}
          >
            <View className="p-4 rounded-full ">
              <BackArrow />
            </View>
          </TouchableOpacity>
        </View>
        <Text
          className="text-[16px] text-center mt-[40px] mb-[20px] text-[#2e2c43]"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Your History
        </Text>
        <View className="flex-1 justify-center">
          <View className="flex flex-row justify-between px-[40px] items-end">
            {
              tab === "All" && <Text className="text-[16px] text-center text-[#2e2c43]"
                style={{ fontFamily: "Poppins-Bold" }} >{retailerHistory?.length} {retailerHistory?.length>1?"Requests":"Request"} </Text>
            }
            {
              tab === "Closed" && <Text className="text-[16px] text-center text-[#2e2c43]"
                style={{ fontFamily: "Poppins-Bold" }} >{closedRequests?.length} {closedRequests?.length>1?"Requests":"Request"}</Text>
            }
            {
              tab === "Completed" && <Text className="text-[16px] text-center text-[#2e2c43]"
                style={{ fontFamily: "Poppins-Bold" }} >{completedRequests?.length} {completedRequests?.length>1?"Requests":"Request"}</Text>
            }
            {
              tab === "Rejected" && <Text className="text-[16px] text-center text-[#2e2c43]"
                style={{ fontFamily: "Poppins-Bold" }} >{rejectedRequests?.length} {rejectedRequests?.length>1?"Requests":"Request"}</Text>
            }

            <TouchableOpacity
              onPress={() => setDropdownVisible(!dropdownVisible)}
              style={styles.dropdown}
            >
              <Text style={styles.dropdownText}>{tab}</Text>
              {!dropdownVisible && <DropDown width={16} height={20} />}
              {dropdownVisible && <DropDownUp width={16} height={20} />}
            </TouchableOpacity>

          </View>
          {dropdownVisible && (
            <View style={styles.dropdownOptions}>
              <TouchableOpacity
                onPress={() => handleSelect("All")}
                style={styles.option}
              >
                <Text style={styles.optionText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSelect("Completed")}
                style={styles.option}
              >
                <Text style={styles.optionText}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSelect("Closed")}
                style={styles.option}
              >
                <Text style={styles.optionText}>Closed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSelect("Rejected")}
                style={styles.option}
              >
                <Text style={styles.optionText}>Rejected</Text>
              </TouchableOpacity>
            </View>
          )}
          <View className="flex flex-col mt-[20px] mb-[160px] items-center justify-center">
            {tab === "All" &&
              (retailerHistory && retailerHistory.length > 0 ? (
                retailerHistory.map((product) => (
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
                      shadowColor: "#bdbdbd",
                      shadowOffset: { width: 8, height: 6 },
                      shadowOpacity: 0.9,
                      shadowRadius: 24,
                      elevation: 20,
                      borderRadius: 24,
                    }}
                  >
                    <ProductOrderCard key={product._id} product={product} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text
                  className="text-[14px] text-center mb-[20px] text-[#2e2c43]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  No History
                </Text>
              ))}
            {tab === "Completed" &&
              (completedRequests && completedRequests.length > 0 ? (
                completedRequests.map((product) => (
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
                      shadowColor: "#bdbdbd",
                      shadowOffset: { width: 8, height: 6 },
                      shadowOpacity: 0.9,
                      shadowRadius: 24,
                      elevation: 20,
                      borderRadius: 24,
                    }}
                  >
                    <ProductOrderCard key={product._id} product={product} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text
                  className="text-[14px] text-center mb-[20px] text-[#2e2c43]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  No Completed Requests
                </Text>
              ))}
            {tab === "Rejected" &&
              (rejectedRequests && rejectedRequests.length > 0 ? (
                rejectedRequests.map((product) => (
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
                      shadowColor: "#bdbdbd",
                      shadowOffset: { width: 8, height: 6 },
                      shadowOpacity: 0.9,
                      shadowRadius: 24,
                      elevation: 20,
                      borderRadius: 24,
                    }}
                  >
                    <ProductOrderCard key={product._id} product={product} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text
                  className="text-[14px] text-center mb-[20px] text-[#2e2c43]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  No Rejected Requests
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
                      shadowColor: "#bdbdbd",
                      shadowOffset: { width: 8, height: 6 },
                      shadowOpacity: 0.9,
                      shadowRadius: 24,
                      elevation: 20,
                      borderRadius: 24,
                    }}
                  >
                    <ProductOrderCard key={product._id} product={product} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text
                  className="text-[14px] text-center mb-[20px] text-[#2e2c43]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  No Closed Requests
                </Text>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 10,
    marginBottom: 20,
    marginRight: 20,
    position: "relative",




  },
  dropdown: {

    padding: 12,
    borderWidth: 2,
    borderColor: "#fb8c00",
    borderRadius: 16,
    width: 160,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20,
    position: "relative",

  },
  dropdownText: {
    fontSize: 16,
    color: "#fb8c00",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  dropdownOptions: {
    // marginTop: 10,
    // borderWidth: 1,
    top: 60,
    right: 40,
    zIndex: 100,
    position: "absolute",
    borderRadius: 16,
    width: 160,
    backgroundColor: "white",
    elevation: 5, // Add shadow for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Add shadow for iOS
    shadowOpacity: 0.2, // Add shadow for iOS
    shadowRadius: 2, // Add shadow for iOS
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "#fb8c00",
    fontFamily: "Poppins-Regular",
    textAlign: "center",

  },
});
