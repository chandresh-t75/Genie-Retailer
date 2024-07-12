import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native';
import ModalImg from "../assets/ModalImg.svg"
import { useNavigation } from '@react-navigation/native';

const ModalScreen = ({modalVisible,setModalVisible,setModalConfirmVisible}) => {
  // const [modalVisible, setModalVisible] = useState(true);
  const navigation=useNavigation();
  const handleModal=()=>{
    setModalVisible(false);
    setModalConfirmVisible(true);
    //  navigation.navigate('location');
  }
  return (
    
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        // onRequestClose={() => {
        //   Alert.alert('Modal has been closed.');
        //   setModalVisible(!modalVisible);
        // }}
        className=" flex justify-center items-center  rounded-lg h-full ">
          <View className="flex-1  justify-center items-center">
                  <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl">
                      <ModalImg classname="w-[117px] h-[75px]"/>
                        <View className="">
                             <Text className="text-[15px]  text-center text-[#2E2C43]" style={{ fontFamily: "Poppins-Bold" }}>Are you at your store right {"\n"} now? </Text>
                              <Text className="text-[12px] font-normal text-center  pt-[8px] text-[#2E2C43]" style={{ fontFamily: "Poppins-Regular" }}>We are fetching your location to help customers find your shop.</Text>
                              <Text className="text-[#E76063] text-[12px] text-center" style={{ fontFamily: "Poppins-Regular" }}>*Please be on store first</Text>
                        </View>
                        
                            <View className="w-full flex flex-row  justify-center">
                              <View className="flex-1 mt-[10px]">
                                  <TouchableOpacity onPress={handleModal} >
                                    <Text className="text-[14.5px]  text-center text-[#FB8C00]" style={{ fontFamily: "Poppins-Regular" }}>No</Text>
                          
                                  </TouchableOpacity> 
                              </View>
                            <View className="flex-1 mt-[10px]">
                                <TouchableOpacity onPress={()=>{setModalVisible(false)}} >
                                  <Text className="text-[14.5px]  text-center text-[#FB8C00]" style={{ fontFamily: "Poppins-Bold" }}>Yes</Text>
                       
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

export default ModalScreen