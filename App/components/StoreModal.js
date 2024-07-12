import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native';
import ModalImg from "../assets/ModalImg.svg"
import { useNavigation } from '@react-navigation/native';

const StoreModal = ({modalConfirmVisible,setModalConfirmVisible}) => {
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
                  <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl">
                      <ModalImg width={195} height={125}/>
                        <Text className="text-[16px]  text-center" style={{ fontFamily: "Poppins-Bold" }}>Set your store name</Text>
                        <View className="flex gap-[8px]">
                            <Text className="text-[14px] text-center text-[#001B33]" style={{ fontFamily: "Poppins-Regular" }}>If you have your own store , you have to set your store name and owner name separately. </Text>
                            <Text className="text-[14px] text-center text-[#001B33] " style={{ fontFamily: "Poppins-Regular" }}>If you have not your own store ,You are an independent service provider,  you can set same name for store name and store owner name . </Text>
                        </View>
                        
                            <View className="w-full flex flex-row  justify-center">
                              <View className="flex-1 mt-[10px]">
                                  <TouchableOpacity onPress={handleModal} >
                                    <Text className="text-[16px]  text-center text-[#FB8C00]" style={{ fontFamily: "Poppins-Bold" }}>OK</Text>
                          
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

export default StoreModal