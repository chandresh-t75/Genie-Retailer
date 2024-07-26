import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ItemImg from "../assets/ItemImg.svg"
import Time from "../assets/time.svg"
import Calendar from "../assets/calendar.svg"
import { formatDateTime } from '../screens/utils/lib'
import ProductImg from "../assets/ProductImg.svg"

const ProductOrderCard = ({product}) => {
    // console.log("productdetails",product);
    // const prods = product?.filter(product => 
    //     product?.users?.some(user => user?.type === 'UserRequest')
    // );
    const prod=product;
    // console.log("prod",prod.requestId?.requestImages[0]);
    

//    console.log('data and time', prod?.latestMessage?.sender?.type, prod?.)

    // Call the function to format the date and time
    const { formattedTime, formattedDate } = formatDateTime(prod?.updatedAt);
  return (
    <View className="max-w-[340px] flex-row relative items-center justify-between bg-white gap-[15px]  rounded-3xl shadow-2xl  px-[20px] h-max py-[20px]" >
                        {
                        prod?.latestMessage?.sender?.type==="UserRequest" && prod?.unreadCount>0 &&
                        <View className="w-[20px] h-[20px] flex justify-center items-center  rounded-full absolute -top-[10px] right-[20px]" style={{backgroundColor:"#558B2F"}}>
                            <Text className="text-white text-center" style={{ fontFamily: "Poppins-Regular" }} >{prod?.unreadCount}</Text>
                        </View>
                        }
                        <View className="w-[95px] h-[95px]  rounded-[15px]">
                        {
                            prod?.requestId?.requestImages?.length>0 ?
                            (<Image source={ {uri: prod.requestId.requestImages[0] }} className="w-full h-full object-contain rounded-[15px]"  />):(
                                <ProductImg width={90} height={90} className=" rounded-[15px]" />
                            )
                            
                        }
          
                        
                          
                       </View>
                        

                        <View className="w-10/12 px-[10px]"> 
                            <View className="flex flex-wrap w-10/12 pb-1 ">
                                <Text className="text-[14px] w-full text-[#2E2C43]" style={{ fontFamily: "Poppins-Regular" }}>{prod?.requestId?.requestDescription}</Text>
                            </View>

                            <View className="flex-row py-1 w-10/12 ">
                                <Text className="text-[12px] text-[#2E2C43]" style={{ fontFamily: "Poppins-Medium" }}>Expected Price: </Text>
                                <Text className="text-[12px] text-[#70B241] " style={{ fontFamily: "Poppins-SemiBold" }}>Rs. {prod?.requestId?.expectedPrice}</Text>
                            </View>
                            <View className="flex-row gap-[8px] w-10/12">
                                <View className="flex-row items-center  gap-[8px]">
                                    <Time size={13}/>
                                    <Text className="text-[12px] text-[#001B33]" style={{ fontFamily: "Poppins-Regular" }}>{formattedTime}</Text>
                                </View>
                                <View className="flex-row items-center gap-[8px]">
                                    <Calendar size={11}/>
                                    <Text className="text-[12px] text-[#001B33]" style={{ fontFamily: "Poppins-Regular" }}>{formattedDate}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
  )
}

export default ProductOrderCard

const styles = StyleSheet.create({})