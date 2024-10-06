import { View, Text, Modal, TouchableOpacity, Linking,Image } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CallIcon from "../assets/call.svg";
import Profile from "../assets/ProfileIcon2.svg";

// import ShopLogo from '../assets/shopLogo.svg';

const CallCustomerModal = ({ callModal, setCallModal }) => {
   
    const requestInfo = useSelector(
        (state) => state.requestData.requestInfo || {}
      );

    //   console.log(requestInfo)

    const makeCall = () => {
        const url = `tel:${requestInfo?.customerId?.mobileNo}`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    return (
        <Modal
            transparent={true}
            visible={callModal}
            animationType="fade"
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setCallModal(false)}
            >
                <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>


                    <View className="">
                        <View className="flex-row justify-center">
                        {requestInfo?.customerId?.pic ? (
                    <Image
                      source={{ uri: requestInfo?.customerId?.pic }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 100,
                        objectFit: "cover",
                      }}
                      // className="w-[40px] h-[40px] rounded-full"
                    />
                  ) : (
                    <Profile className="w-full h-full rounded-full" />
                  )}
                        </View>
                        <Text className="capitalize text-center mt-[30px] text-[16px]" style={{ fontFamily: "Poppins-Regularx" }}>
                            {requestInfo?.customerId?.userName <= 20 ? requestInfo?.customerId?.userName : `${requestInfo?.customerId?.userName.slice(0, 20)}...`}
                        </Text>

                        {/* <Text className="capitalize  text-center text-[#2b2c43] text-[16px]" style={{ fontFamily: "Poppins-ExtraBold" }}>
                            {currentSpadeRetailer?.retailerId?.storeName.length <= 50 ? currentSpadeRetailer?.retailerId?.storeName : `${currentSpadeRetailer?.retailerId?.storeName?.slice(0, 50)}...`}

                        </Text> */}
                        <Text className="capitalize text-center mb-[20px] text-[#79b649] text-[16px]" style={{ fontFamily: "Poppins-ExtraBold" }}>
                            +91 {requestInfo?.customerId?.mobileNo.slice(3)}
                        </Text>
                        <TouchableOpacity onPress={() => makeCall()}>
                            <View className="flex-row items-center justify-center gap-[10px] border-2 border-[#fb8c00] rounded-2xl mx-[30px] pb-[10px] pt-[15px]">
                                <CallIcon />
                                <Text className="text-center text-[#fb8c00] " style={{ fontFamily: 'Poppins-Bold' }}>
                                    Call Customer
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = {
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '85%',
        paddingVertical: 40,
        paddingHorizontal: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        position: 'relative'
    }
}

export default CallCustomerModal;