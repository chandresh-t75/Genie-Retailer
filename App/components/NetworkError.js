import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import NetworkIssueIcon from '../assets/InternetIssueIcon.svg';

const NetworkError = ({ callFunction, setNetworkError }) => {
    return (
        <View className="flex w-[90%] justify-center items-center mb-[100px] bg-white mx-[30px] rounded-3xl py-[30px]" style={{
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 4,
        }}>
            <View className=" justify-center items-center  ">

                <NetworkIssueIcon height={150} />
                <Text className="text-[#2e2c43] text-[14px] " style={{ fontFamily: 'Poppins-Regular' }}>No Internet Connection</Text>
                <Text className="text-[#2e2c43] text-[14px] text-center px-[30px]" style={{ fontFamily: 'Poppins-Regular' }}>Check your connection, then refresh the page</Text>
                <TouchableOpacity onPress={() => { setNetworkError(false); callFunction(); }}>
                    <Text className="text-[#fb8c00] text-[14px] text-center border-2 border-[#fb8c00] px-[50px] py-[10px] mt-[30px]" style={{ fontFamily: 'Poppins-Bold' }}>Refresh</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default NetworkError;