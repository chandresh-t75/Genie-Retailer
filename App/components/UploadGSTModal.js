import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native';
import ModalImg from "../assets/ModalImg.svg"
import GSTVerify from "../assets/GSTVerifyImg.svg"

import RemainingCustomer from "../assets/CustomerRemainImg.svg"
import { useNavigation } from '@react-navigation/native';

const UploadGSTModal = ({modalConfirmVisible,setModalConfirmVisible}) => {
  // const [modalVisible, setModalVisible] = useState(true);
  const navigation=useNavigation();
  const handleModal=()=>{
    setModalConfirmVisible(false);
    // navigation.navigate('home');
  }
  return (
    
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalConfirmVisible}
        // onRequestClose={() => {
        //   Alert.alert('Modal has been closed.');
        //   setModalVisible(!modalVisible);
        // }}
        className=" flex justify-center items-center  rounded-lg h-full ">
          <View className="flex-1  justify-center items-center">
                  <View className="bg-white w-[90%] p-[30px] py-[40px] justify-center items-center mt-[10px] gap-[20px] shadow-gray-600 shadow-2xl">
                      <GSTVerify width={100} height={60}/>
                        <Text className="text-[16px]  text-center" style={{ fontFamily: "Poppins-Black" }}>You have not uploaded {"\n"} GST/Labor certificate yet</Text>
                        <View className="flex gap-[8px]">
                            <Text className="text-[12px] text-center" style={{ fontFamily: "Poppins-Regular" }}>Please upload the certificate to accept new requests.</Text>
                            {/* <Text className="text-[12px] text-center text-[#E76063]" style={{ fontFamily: "Poppins-Regular" }}>T & C* Applied</Text> */}
                        </View>
                        
                            <View className="w-full flex flex-row  justify-center">
                              <View className="flex-1 mt-[10px] flex flex-row justify-around">
                                  <TouchableOpacity onPress={handleModal} >
                                    <Text className="text-[16px]  text-center text-[#FB8C00]" style={{ fontFamily: "Poppins-Regular" }}>Close</Text>
                          
                                  </TouchableOpacity> 
                                  <TouchableOpacity onPress={()=>{navigation.navigate("profile");setModalConfirmVisible(false);}} >
                                    <Text className="text-[16px]  text-center text-[#FB8C00]" style={{ fontFamily: "Poppins-Bold" }}>Proceed</Text>
                          
                                  </TouchableOpacity> 
                              </View>
                </View>
           </View>
      </View>
      </Modal>
      
      
  );
};

const styles = StyleSheet.create({
  
  // modalView: {
  //   margin: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
  
});

export default UploadGSTModal