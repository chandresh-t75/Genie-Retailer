import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AccountVerify from "../assets/AccountVerifyImg.svg"



const HomeScreenUnverified = () => {


  return (
    <View className="flex flex-col gap-[32px] bg-white px-[32px]">
                <View className="flex justify-center items-center">
                <View className="bg-white w-[90%] flex-col items-center  py-[32px] rounded-md gap-[18px]">
                    <AccountVerify className="bg-white w-[270px] h-[117px]" />
                   <Text className="text-[14px] text-center" style={{ fontFamily: "Poppins-Bold" }}>Thank You!</Text>
                    <Text className=" text-[14px] text-center" style={{ fontFamily: "Poppins-Regular" }}>We got your request for authentic retailer on our platform. 
                    </Text>
                    <Text className="text-[14px] text-center" style={{ fontFamily: "Poppins-Regular" }}>
                    Please wait. Our team will contact you to verify the info you gave us. 
                    </Text>

                </View>
                </View>
    </View>
  )
}

export default HomeScreenUnverified

const styles = StyleSheet.create({})