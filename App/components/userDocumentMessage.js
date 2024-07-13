import { StyleSheet, Text, View, Image, ScrollView, Animated, Linking } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDateTime } from '../screens/utils/lib';

const UserDocumentMessage = ({ bidDetails }) => {
    // console.log("bidDetails", bidDetails);


    const userDetails = useSelector(store => store.storeData.userDetails);

    const { formattedTime, formattedDate } = formatDateTime(
        bidDetails?.updatedAt
    );
    const requestInfo = useSelector(state => state.requestData.requestInfo);

    const handleDownloadDocument = async () => {
        // const url = `https://www.google.com/search?q=${encodeURIComponent(bidDetails.bidImages[0])}`
        const url = `${bidDetails.bidImages[0]}`;
        Linking.openURL(url)
            .catch((err) => console.error('An error occurred', err));
    }

    return (
        <View className="flex gap-[19px]  border-[1px] border-gray-200   rounded-3xl w-[297px] h-[max-content] py-[10px] items-center bg-[#ebebeb]">
            <View className="flex-row mx-[25px] ">
                <View className="flex-row  ">
                    <View className="w-[25%]" >
                        <Image
                            source={{ uri: requestInfo?.customerId.pic }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    </View>
                    <View className="w-[75%]">
                        <View className="flex-row justify-between">
                            <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Bold" }}>{requestInfo?.customerId?.userName}</Text>
                            <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>{formattedTime}</Text>
                        </View>

                        {bidDetails.message.length > 0 && <View>
                            <Text className="text-[12px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.message}</Text>
                        </View>}
                        <View className="flex-row gap-[10px] pb-[10px]">
                            <View>
                                <MaterialCommunityIcons name="file-document-multiple-outline" size={40} color="#2E2C43" />
                            </View>
                            <View>
                                <Text>{bidDetails?.bidImages[0].slice(bidDetails?.bidImages[0].length - 15, bidDetails?.bidImages[0].length)}</Text>
                                <View className="flex-row items-center gap-[10px]">
                                    <View>

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: "gray",
                                                padding: 3,
                                                borderRadius: 100,
                                            }}
                                            onPress={() => { handleDownloadDocument() }}
                                        >
                                            <Feather name="download" size={18} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text>{(bidDetails.bidPrice) / (1e6) < 1 ? `${(parseFloat(bidDetails.bidPrice) / (1e3)).toFixed(1)}kb` : `${(parseFloat(bidDetails.bidPrice) / (1e6)).toFixed(1)}Mb`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            </View>




        </View >
    )
}

export default UserDocumentMessage;

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
        borderRadius: 20
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
        height: 50
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
        textAlign: "center"
    },
});