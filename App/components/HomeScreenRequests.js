import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import  BucketImg from "../assets/BucketImg.svg"
import Card from "../assets/requestCard.svg"
import Home2 from "../assets/Home2.svg"
import Home3 from "../assets/Home3.svg"
import Home4 from "../assets/Home4.svg"
import Home5 from "../assets/Home5.svg"
import Home6 from "../assets/Home6.svg"
import Home7 from "../assets/Home7.svg"
import CustomerRemain from "../assets/CustomerRemainImg.svg";
import GSTVerify from "../assets/GSTVerifyImg.svg";
import QueIcon from "../assets/QuestionIcon.svg";
import RightArrow from "../assets/RightArrowGold.svg";
import Time from "../assets/TimeRed.svg";
import RemainingCustomerModal from "./RemainingCustomerModal";


import ThumbIcon from "../assets/ThumbIcon.svg"
import { useSelector } from 'react-redux'

const HomeScreenRequests = ({ modalVisible, setModalVisible }) => {
   const userData = useSelector((state) => state.storeData.userDetails);
  const { width } = Dimensions.get("window");

  return (
    <View className="flex items-center flex-col gap-[0px] bg-white">
                <View className="flex flex-row gap-[32px] bg-white py-[30px] max-w-[340px] justify-center items-center rounded-3xl shadow-md px-[20px]"
                 style={{
                  backgroundColor: '#fff', // Ensure the background is white
                  margin: 10, // Add some margin if necessary for better shadow visibility
                  shadowColor: '#bdbdbd',
                  shadowOffset: { width: 8, height: 6 },
                  shadowOpacity: 0.9,
                  shadowRadius: 24,
                  elevation: 20,
                  borderRadius:24
                }}>
                    <View className="w-[16px] h-[16px] bg-[#70B241] rounded-full">
                    </View>
                    <View className="flex-col flex-1">
                    <Text className="text-[16px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Bold" }}>You are live now</Text>
                    <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Wait for your first customer request</Text>
                    </View>
                    
                 </View> 
                 <View
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
                    <View className="max-w-[340px] flex flex-row p-[20px] gap-[20px] items-center">
                      <CustomerRemain width={92} height={76} />
                      <View className="w-10/12 flex-col gap-[5px]">
                        <View className="flex-row gap-[10px]">
                          <Text
                            className="text-[14px]"
                            style={{ fontFamily: "Poppins-Regular" }}
                          >
                            Customer Remaining
                          </Text>
                          <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                          >
                            <QueIcon />
                          </TouchableOpacity>
                        </View>
                        <Text
                          className={`text-[24px]  ${
                            userData?.freeSpades <= 50
                              ? "text-[#E76063]"
                              : "text-[#FB8C00]"
                          }`}
                          style={{ fontFamily: "Poppins-Black" }}
                        >
                          {userData?.freeSpades} / 1000
                        </Text>
                        {/* <TouchableOpacity>
                            <View className="flex flex-row items-center gap-[10px]">
                            <Text className="text-[14px] text-[#FB8C00]" style={{ fontFamily: "Poppins-Regular" }}>
                                Add more
                              </Text>
                            <RightArrow/>

                            </View>

                          </TouchableOpacity> */}
                      </View>
                    </View>
                  </View>
                  {/* gst verification card */}
                  {!userData?.documentVerified && (
                    <View
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
                      className="max-w-[340px]"
                    >
                      <View className="w-full flex flex-row p-[20px] gap-[20px] items-center">
                        <GSTVerify width={80} height={60} />
                        <View className="w-10/12 px-[10px] flex-col gap-[5px]">
                          <View className="w-full flex-row gap-[10px]">
                            <Text
                              className="text-[14px]"
                              style={{ fontFamily: "Poppins-Regular" }}
                            >
                              Attach your GST/Labor{"\n"}certificate
                            </Text>
                            {/* <TouchableOpacity>
                              <QueIcon />
                            </TouchableOpacity> */}
                          </View>
                          {/* <View className="flex flex-row items-center gap-[10px]">
                                 <Time/>
    
                                <Text className="text-[14px] text-[#E76063]" style={{ fontFamily: "Poppins-Regular" }}>
                                   <Text>{remainingDays}</Text> Days remaining
                                  </Text>
    
                                </View> */}
                          {userData?.panCard?.length == 0 && (
                            <TouchableOpacity
                              onPress={() => navigation.navigate("gstVerify")}
                            >
                              <View className="flex flex-row items-center gap-[10px]">
                                <View className="flex flex-row items-center gap-[10px]">
                                  <Text
                                    className="text-[14px] text-[#FB8C00]"
                                    style={{ fontFamily: "Poppins-Regular" }}
                                  >
                                    Add Now
                                  </Text>
                                  <RightArrow/>
                                </View>
                              </View>
                            </TouchableOpacity>
                          )}
                          {userData?.panCard?.length > 0 &&
                            !userData?.documentVerified && (
                              <Text
                                className="text-[14px] text-[#E76063]"
                                style={{ fontFamily: "Poppins-Regular" }}
                              >
                                Waiting for approval
                              </Text>
                            )}
                        </View>
                      </View>
                    </View>
                  )}
                <Text className="text-[14px]  text-[#2E2C43] mt-[20px] mb-[20px] px-[32px]" style={{ fontFamily: "Poppins-Bold" }}>
                    How it works?
                 </Text>
                 <BucketImg/>

                 <View className="flex flex-col mt-[30px] px-[32px]">
                    <Text className="text-[14px] text-center text-[#2E2C43]" style={{ fontFamily: "Poppins-Regular" }}>
                    CulturTap Genie is a platform where Genie connects you with customers online. You need to attract customers by offering the best price for your products or services.
                    </Text>
                 </View>
                 <View className="flex flex-col mt-[20px] justify-center items-center gap-2 ">
                    <Text className="text-[14px] mb-[10px] px-[32px] text-center" style={{ fontFamily: "Poppins-Bold" }}>
                    You get a notification first, like this.
                    </Text>
                    <View className="flex flex-row mb-[20px] justify-center items-center   " style={{
                  backgroundColor: '#fff', // Ensure the background is white
                  // margin: 10, // Add some margin if necessary for better shadow visibility
                  shadowColor: '#bdbdbd',
                  shadowOffset: { width: 9, height: 9},
                  shadowOpacity: 0.7,
                  shadowRadius: 50,
                  elevation: 80,
                  borderRadius:8,

                }}>
                     <Card width={340}  className=""/>
                    </View>
                 </View>
                 <View className="flex items-center gap-2 mb-[10px] ">
                    <Text className="text-[14px] px-[32px]  text-[#2E2C43]  text-center" style={{ fontFamily: "Poppins-Regular" }}>
                    If you have the right product or service availability, you can accept the customer's request. 
                    </Text>
                    <View style={{
                  backgroundColor: '#fff', // Ensure the background is white
                  // margin: 10, // Add some margin if necessary for better shadow visibility
                  shadowColor: '#bdbdbd',
                  shadowOffset: { width: 9, height: 9},
                  shadowOpacity: 0.7,
                  shadowRadius: 50,
                  elevation: 80,
                  borderRadius:8
                }}>
                    <Home2 width={350} className=""/>


                    </View>
                 </View>
                 <View className="gap-[20px] mt-[20px] items-center">
                 <Text className="text-[14px]  px-[32px] text-center" style={{ fontFamily: "Poppins-Bold" }}>
                 Continue bargaining, accept {"\n"} suitable offer
                    </Text>
                    <Text className="text-[14px] px-[32px]  text-[#001B33]  text-center" style={{ fontFamily: "Poppins-Regular" }}>
                    If you're okay with the price the customer offered, choose yes. If you're not okay with the price, choose no.
                    </Text>
                    <View style={{
                  backgroundColor: '#fff', // Ensure the background is white
                  // margin: 10, // Add some margin if necessary for better shadow visibility
                  shadowColor: '#bdbdbd',
                  shadowOffset: { width: 9, height: 9},
                  shadowOpacity: 0.7,
                  shadowRadius: 50,
                  elevation: 80,
                  borderRadius:8
                }}>
                    <Home3 width={350}  className=" "/>
                    </View>
                 </View>
                 <View className="gap-[24px] mt-[20px]  items-center">
                    <Text className="text-[14px] px-[32px]  text-[#2E2C43]  text-center my-[10px]" style={{ fontFamily: "Poppins-Regular" }}>
                    You can ask a question to a customer or make a new offer.
                    </Text>
                    <View style={{
                  backgroundColor: '#fff', // Ensure the background is white
                  // margin: 10, // Add some margin if necessary for better shadow visibility
                  shadowColor: '#bdbdbd',
                  shadowOffset: { width: 9, height: 9},
                  shadowOpacity: 0.35,
                  shadowRadius: 50,
                  elevation: 80,
                  borderRadius:8
                }}>
                    <Home7 width={350}  className=" "/>
                    </View>
                 </View>
                 <View className="px-[32px] items-center gap-[30px] mt-[30px]">
                     <Text className="text-[14px]  text-[#2E2C43]  text-center" style={{ fontFamily: "Poppins-Bold" }}>
                        How to send offer to the customer?
                     </Text>
                     <View className="gap-[20px] items-center px-[32px]">
                     <View className="flex-row gap-[5px] justify-center items-center">
                        <Text className="text-[14px] bg-[#FB8C00] p-2  text-white  text-center" style={{ fontFamily: "Poppins-Medium" }}>
                           Step1.
                        </Text>
                        <Text className="text-[14px]  text-[#2E2C43]  text-center" style={{ fontFamily: "Poppins-Regular" }}>Type your response </Text>
                     </View>
                    <Home4 width={width} className=" "/>
                     </View>
                     <View className="flex gap-[20px] px-[32px] items-center ">
                        <View className="flex-row gap-[5px] ">
                           <Text className="text-[14px] bg-[#FB8C00] h-[40px] p-2    text-white   text-center " style={{ fontFamily: "Poppins-Medium"}}>
                            Step 2.
                           </Text>
                           <Text className="text-[14px]  text-[#2E2C43]  text-center" style={{ fontFamily: "Poppins-Regular" }}>Click the real product image for right product match and confirm availability.</Text>
                        </View>
                        <Home5 width={width}   className=" "/>
                     </View>
                     <View className="flex gap-[20px] ">
                        <View className="flex-row gap-[5px] justify-center items-center">
                           <Text className="text-[14px] bg-[#FB8C00] p-2  text-white  text-center" style={{ fontFamily: "Poppins-Medium" }}>
                            Step 3.
                           </Text>
                           <Text className="text-[14px]  text-[#2E2C43]  text-center" style={{ fontFamily: "Poppins-Regular" }}>Type your offered price to the customer  </Text>
                        </View>
                        <Home6 width={width}  className=" "/>
                     </View>
                 
                  
                 </View>
                 <View className="gap-[20px] mt-[20px] items-center">
                    <Text className="text-[14px] px-[32px]  text-[#2E2C43]  text-center" style={{ fontFamily: "Poppins-Regular" }}>
                       Preview & Send your offer
                    </Text>
                    <ThumbIcon  className=" "/>
                 </View>
                 <View className="flex flex-col gap-[32px] px-[32px] my-[40px]">
                    {/* image */}
                  
                 </View>
    </View>
  )
}

export default HomeScreenRequests

const styles = StyleSheet.create({})