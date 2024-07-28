import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import ModalImg from "../assets/Cancel.svg"
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserDetails } from '../redux/reducers/storeDataSlice';
import axiosInstance from '../screens/utils/axiosInstance';
import { baseUrl } from '../screens/utils/constants';

const DeleteImageModal= ({modalVisible,setModalVisible,index}) => {
  // const [modalVisible, setModalVisible] = useState(true);
  const navigation=useNavigation();
  const user = useSelector((state) => state.storeData.userDetails);
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false);
  const accessToken = useSelector((state) => state.storeData.accessToken)


//   const handleModal=()=>{
//     try {
//             // Remove the item with key 'userData' from local storage
//             const updatedImages = [...imagesLocal];
//             updatedImages.splice(index, 1);
//             setImagesLocal(updatedImages);
//             setModalVisible(false);
//         } catch (error) {
//             console.error('Error deleting image:', error);
//         }
   
   
//   }

  const handleModal = async () => {
    setLoading(true);
    if (index >= 0 && index < user.storeImages.length) {
      const updatedStoreImages = [
        ...user.storeImages.slice(0, index),
        ...user.storeImages.slice(index + 1),
      ];
      const updatedUser = {
        ...user,
        storeImages: updatedStoreImages,
      };
      dispatch(setUserDetails(updatedUser));
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

      const config = {
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${accessToken}`,
        }
       }
      await axiosInstance
        .patch(`${baseUrl}/retailer/editretailer`, {
          _id: user?._id,
          storeImages: updatedUser.storeImages,
        },config
      )
        .then(async (res) => {
          dispatch(setUserDetails(res.data));
          await AsyncStorage.setItem("userData", JSON.stringify(res.data));
          setModalVisible(false);
          setLoading(false)
        });
    } else {
          setLoading(false)
      console.error("Invalid index for deleting image");
    }
  };


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
                             <Text className="text-[15px]  text-center text-[#001B33]" style={{ fontFamily: "Poppins-Bold" }}> Are you sure? </Text>
                              <Text className="text-[14px]  text-center  pt-[8px] text-[#001B33]" style={{ fontFamily: "Poppins-Regular" }}>You are removing a store image </Text>
                        </View>
                        
                            <View className="w-full flex flex-row  justify-center">
                              <View className="flex-1 mt-[5px]">
                                  <TouchableOpacity onPress={()=>{setModalVisible(false)}} >
                                    <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-Regular" }}>Cancel</Text>
                          
                                  </TouchableOpacity> 
                              </View>
                            <View className="flex-1 mt-[5px]">
                                <TouchableOpacity onPress={handleModal}>
                                {loading ? (
                  <ActivityIndicator size="small" color="#FB8C00" />
                ) : (
                  <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-Bold" }}>
                    Remove
                  </Text>
                )}
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

export default DeleteImageModal;