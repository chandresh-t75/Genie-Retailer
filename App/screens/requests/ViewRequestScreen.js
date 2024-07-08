import { View, Text, Pressable, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome ,Entypo} from "@expo/vector-icons";
import BackArrow from "../../assets/arrow-left.svg"




const ViewRequestScreen = () => {
    const navigation = useNavigation();
    const requestInfo= useSelector(state => state.requestData.requestInfo);

    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:"white"}}>
            <View className=" flex z-40 flex-row items-center justify-center mt-[20px] mb-[24px] mx-[36px]">
            <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ padding:20,paddingRight:10,zIndex:30}}
          >
            <BackArrow  />
          </TouchableOpacity>
                <Text className="flex flex-1 justify-center items-center text-center text-[16px]" style={{ fontFamily: "Poppins-Bold" }}>View Request</Text>
                {/* <Pressable onPress={() => { navigation.navigate('requestpreview'); }}>
                    <Text className="text-[14px]" ></Text>
                </Pressable> */}

            </View>

            <View className="mx-[34px] mt-[10px]">
                <Text className=" text-[#2e2c43] text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>Spades of master</Text>
                <Text className=" mt-2" style={{ fontFamily: "Poppins-Regular" }}>{requestInfo?.requestId?.requestDescription}</Text>

                <Text className=" text-[#2e2c43] text-[14px] mt-[36px] mb-[15px]" style={{ fontFamily: "Poppins-Bold" }}>Reference image for sellers</Text>

                <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 4, paddingHorizontal: 5, }}>
                    {
                        requestInfo?.requestId?.requestImages?.map((image, index) => (
                            <View key={index}>
                                <Image source={{ uri: image }} style={{ height: 150, width: 120, borderRadius: 24, backgroundColor: '#EBEBEB' }} />
                            </View>
                        ))
                    }
                </ScrollView>

                <Text className=" text-[#2e2c43] text-[14px] mt-[60px]" style={{ fontFamily: "Poppins-Bold" }}>Your expected price</Text>
                <Text className="text-[#558b2f] " style={{ fontFamily: "Poppins-SemiBold" }}>{requestInfo?.requestId?.expectedPrice} Rs</Text>
            </View>





        </SafeAreaView>
    )
}

export default ViewRequestScreen