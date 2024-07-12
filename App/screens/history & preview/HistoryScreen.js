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
import DropDown from "../../assets/dropDown.svg"
import DropDownUp from "../../assets/dropDownUp.svg"





const HistoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const retailerHistory = useSelector(
    (state) => state.requestData.retailerHistory || []
  );
  const [tab, setTab] = useState("All Requests");
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
      if (request?.requestType === "cancelled") {
        rejected.push(request);
      } else if (request?.requestType === "closed" && request.requestId?.requestAcceptedChat===request._id) {
        completed.push(request);
      }
      else{
        closed.push(request);
      }
    });

    setRejectedRequests(rejected);
    setClosedRequests(closed);
    setCompletedRequests(completed);
  }, [retailerHistory]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <View className="flex flex-row z-40 justify-center items-center px-[32px] ">
        <TouchableOpacity onPress={() => {navigation.goBack()}} 
                     style={{
                      position:"absolute",
                      left:10,
                      top:12,
                      zIndex:40,
                      padding:20,

                     }}>
                     <View className="p-4 rounded-full ">
                       <BackArrow />
                    </View>
                     </TouchableOpacity>
         
        </View>
        <Text
          className="text-[16px] text-center mt-[40px] mb-[20px] "
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Your History
        </Text>
        <View className="flex-1">
        <View style={styles.container} >
      <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.dropdown}>
        <Text style={styles.dropdownText}>{tab}</Text>
        {
        !dropdownVisible && 
        <DropDown width={16} height={20}/>

        }
         {
        dropdownVisible && 
        <DropDownUp width={16} height={20}/>

        }
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdownOptions}>
          <TouchableOpacity onPress={() => handleSelect('All Requests')} style={styles.option}>
            <Text style={styles.optionText}>All Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect('Completed Requests')} style={styles.option}>
            <Text style={styles.optionText}>Completed Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect('Closed Requests')} style={styles.option}>
            <Text style={styles.optionText}>Closed Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect('Rejected Requests')} style={styles.option}>
            <Text style={styles.optionText}>Rejected Requests</Text>
          </TouchableOpacity>
         
          
          
        </View>
      )}
    </View>
          <View className="flex flex-col gap-[10px] mb-[20px] items-center justify-center">
          {tab === "All Requests" &&
              (retailerHistory && retailerHistory.length > 0 ? (
                retailerHistory.map((product) => (
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
                      backgroundColor: '#fff', // Ensure the background is white
                      margin: 10, // Add some margin if necessary for better shadow visibility
                      shadowColor: '#bdbdbd',
                      shadowOffset: { width: 8, height: 6 },
                      shadowOpacity: 0.9,
                      shadowRadius: 24,
                      elevation: 20,
                      borderRadius:24
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
                  No History
                </Text>
              ))}
              {tab === "Completed Requests" &&
              (completedRequests && completedRequests.length > 0 ? (
                completedRequests.map((product) => (
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
                      backgroundColor: '#fff', // Ensure the background is white
                      margin: 10, // Add some margin if necessary for better shadow visibility
                      shadowColor: '#bdbdbd',
                      shadowOffset: { width: 8, height: 6 },
                      shadowOpacity: 0.9,
                      shadowRadius: 24,
                      elevation: 20,
                      borderRadius:24
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
                  No Completed Requests
                </Text>
              ))}
            {tab === "Rejected Requests" &&
              (rejectedRequests && rejectedRequests.length > 0 ? (
                rejectedRequests.map((product) => (
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
                      backgroundColor: '#fff', // Ensure the background is white
                      margin: 10, // Add some margin if necessary for better shadow visibility
                      shadowColor: '#bdbdbd',
                      shadowOffset: { width: 8, height: 6 },
                      shadowOpacity: 0.9,
                      shadowRadius: 24,
                      elevation: 20,
                      borderRadius:24
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
                  No Rejected Requests
                </Text>
              ))}

            {tab === "Closed Requests" &&
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
                      backgroundColor: '#fff', // Ensure the background is white
                      margin: 10, // Add some margin if necessary for better shadow visibility
                      shadowColor: '#bdbdbd',
                      shadowOffset: { width: 8, height: 6 },
                      shadowOpacity: 0.9,
                      shadowRadius: 24,
                      elevation: 20,
                      borderRadius:24
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  dropdown: {
    padding: 12,
    borderWidth: 2,
    borderColor:"#fb8c00",
    borderRadius: 16,
    width: 300,
    alignItems: 'center',
    flexDirection:"row",
    justifyContent:"center",
    gap:20
  },
  dropdownText: {
    fontSize: 16,
    color:"#fb8c00",
    fontFamily:"Poppins-Bold"
  },
  dropdownOptions: {
    // marginTop: 10,
    // borderWidth: 1,
    borderRadius: 16,
    width: 300,
    backgroundColor: 'white',
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Add shadow for iOS
    shadowOpacity: 0.2, // Add shadow for iOS
    shadowRadius: 2, // Add shadow for iOS
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color:"#fb8c00",
    fontFamily:"Poppins-Bold"
  },
});
