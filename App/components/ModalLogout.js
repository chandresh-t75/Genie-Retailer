import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native';
import ModalImg from "../assets/Logout.svg"
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUniqueToken, setUserDetails } from '../redux/reducers/storeDataSlice';


const ModalLogout= ({user,modalVisible,setModalVisible}) => {
  console.log("user at menu",user)
  const dispatch=useDispatch();
  // const [modalVisible, setModalVisible] = useState(true);
  const navigation=useNavigation();
  const handleModal=async()=>{
    try {
            // Remove the item with key 'userData' from local storage
           
            //  await auth().signOut(); 
             await messaging().deleteToken();
              console.log('FCM token deleted.');
            const res = await axios.patch(`http://173.212.193.109:5000/retailer/editretailer`, {
             _id: user?._id,
             uniqueToken:""
             });
             navigation.navigate("mobileNumber",{data:""});
             dispatch(setUniqueToken(""));
             console.log('User data deleted successfully',res.data);
            //  setModalVisible(false);
            await AsyncStorage.removeItem('userData');
            setModalVisible(false);
            
             
        } catch (error) {
            console.error('Error deleting user data:', error);
        }
   
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
                             <Text className="text-[15px] font-extrabold text-center">Are you sure? </Text>
                              <Text className="text-[14px] font-normal text-center  pt-[8px]">you are trying to logout </Text>
                              
                        </View>
                        
                            <View className="w-full flex flex-row  justify-center">
                              <View className="flex-1 mt-[5px]">
                                  <TouchableOpacity onPress={()=>{setModalVisible(false)}} >
                                    <Text className="text-[14.5px] text-[#FB8C00] font-normal text-center">Cancel</Text>
                          
                                  </TouchableOpacity> 
                              </View>
                            <View className="flex-1 mt-[5px]">
                                <TouchableOpacity  onPress={handleModal}>
                                  <Text className="text-[14.5px] text-[#FB8C00] font-semibold text-center">Logout</Text>
                       
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

export default ModalLogout;