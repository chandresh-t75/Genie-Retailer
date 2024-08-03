import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Success from "../assets/successImg.svg"

const SuccessConcernModal= ({modalVisible,setModalVisible,type}) => {
  // const [modalVisible, setModalVisible] = useState(true);
  const navigation=useNavigation();
  const handleModal=()=>{
   
            // Remove the item with key 'userData' from local storage
            
            setModalVisible(false);
       
   
   
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
        className=" flex justify-center items-center  rounded-lg ">
          <View className="flex-1  justify-center items-center">
                  <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl" style={{padding:50}}>
                         <Success />
                       
                            <View >
                              {
                                type==="help" && 
                                <Text className="text-[14.5px]   text-center text-[#001B33]" style={{ fontFamily: "Poppins-SemiBold" }}>Help request submitted {"\n"}
                                  successfully</Text>

                              }
                              {
                                type==="report" && 
                                <Text className="text-[14.5px]   text-center text-[#001B33]" style={{ fontFamily: "Poppins-SemiBold" }}>Reported the customer {"\n"}
                                  successfully</Text>
                              }
                              
                                 
                       
                               
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

export default SuccessConcernModal;