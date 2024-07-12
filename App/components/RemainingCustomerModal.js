import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native';
import ModalImg from "../assets/ModalImg.svg"
import RemainingCustomer from "../assets/CustomerRemainImg.svg"
import { useNavigation } from '@react-navigation/native';

const RemainingCustomerModal = ({modalConfirmVisible,setModalConfirmVisible}) => {
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
                      <RemainingCustomer width={139} height={115}/>
                        <Text className="text-[16px]  text-center text-[#001B33]" style={{ fontFamily: "Poppins-Black" }}>Your online request limit</Text>
                        <View className="flex gap-[8px]">
                            <Text className="text-[12px] text-center text-[#001B33]" style={{ fontFamily: "Poppins-Regular" }}>There are charges like 100 rupees for 1000 customers. So please accept and proceed with the customer's request carefully. Only accept requests when you have the right product availability.</Text>
                            <Text className="text-[12px] text-center text-[#E76063]" style={{ fontFamily: "Poppins-Regular" }}>T & C* Applied</Text>
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

export default RemainingCustomerModal