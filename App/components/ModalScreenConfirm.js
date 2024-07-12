import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native';
import ModalImg from "../assets/ModalImg.svg"
import { useNavigation } from '@react-navigation/native';

const ModalScreenConfirm = ({modalConfirmVisible,setModalConfirmVisible}) => {
  // const [modalVisible, setModalVisible] = useState(true);
  const navigation=useNavigation();
  const handleModal=()=>{
    setModalConfirmVisible(false);
    navigation.navigate('completeProfile');
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
                  <View className="bg-white w-[90%] p-[30px] pt-[40px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl">
                      <ModalImg classname="w-[117px] h-[75px]"/>
                        <View className="">
                            <Text className="text-[15px] text-center text-[#2E2C43]" style={{ fontFamily: "Poppins-SemiBold" }}>Please go to the store before creating your business profile.</Text>
                            <Text className="text-[12px] font-normal text-center  pt-[8px] text-[#2E2C43]" style={{ fontFamily: "Poppins-Regular" }}>We will fetch the location of your shop to help customers find it. </Text>
                        </View>
                        
                            <View className="w-full flex flex-row  justify-center">
                              <View className="flex-1 mt-[10px]">
                                  <TouchableOpacity onPress={handleModal} >
                                    <Text className="text-[14.5px]  text-center text-[#fb8c00]" style={{ fontFamily: "Poppins-Bold" }}>Sure</Text>
                          
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

export default ModalScreenConfirm