import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome} from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Profile from "../../assets/ProfileBlack.svg"
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import ModalLogout from '../../components/ModalLogout';
import { setServiceProvider, setUserDetails } from '../../redux/reducers/storeDataSlice';
import BackArrow from "../../assets/BackArrow.svg";






const MenuScreen = () => {
    const navigation = useNavigation();
    const dispatch=useDispatch();
    const user=useSelector(state=>state.storeData.userDetails);
    // const [user,setUser]=useState();
    const[modalVisible,setModalVisible]=useState(false);

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             // Fetch user location from AsyncStorage
    //             // const userData=JSON.parse(await AsyncStorage.getItem('userData'));
    //             //  dispatch(setServiceProvider("unknown"))
    //             console.log("profile",userData);
    //             if (userData) {
    //                     dispatch(setUserDetails(userData));
    //                     console.log("userprofile",user);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching user location:', error)
    //         }
    //     }
    //     fetchUserData()
    // }, [])

    const deleteUserData = async () => {
        setModalVisible(true);
        
    };

    
  return (
    <View style={{ flex: 1,backgroundColor:"white" }}>
       
         <View className="pt-[20px] flex  gap-[60px]" style={{ flex: 1 }} >
             <View className="flex z-40 flex-row px-[32px] items-center ">
                 
                     <TouchableOpacity onPress={() => {navigation.goBack()}} className="flex items-center "
                     style={{
                      position:"absolute",
                      left:0,
                      top:-28,
                      zIndex:40,
                      padding:20,

                     }}>
                     <View className="p-4 rounded-full ">
                       <BackArrow />
                    </View>
                     </TouchableOpacity>
                    
              
                 <Text className="text-[16px] flex-1 flex text-center" style={{ fontFamily: "Poppins-Bold" }}>Menu</Text>
             </View>

            <TouchableOpacity onPress={()=>navigation.navigate("profile")} 
                  style={{
                    backgroundColor: '#fff', // Ensure the background is white
                    margin: 16, // Add some margin if necessary for better shadow visibility
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                    borderRadius:16
                  }}
                >
                <View className="flex items-center    ">
                    <View className="flex flex-row gap-[32px] bg-white py-[48px] justify-center  w-[90%] items-center ">
                        {
                             user?.storeImages?.length>0 ?( <Image source={{ uri:user?.storeImages[0] }} width={70} height={70} className="rounded-full" />):
                    (
                        <Profile  width={40} height={40}/>
                    )

                        }
                        <View className="flex-col">
                            <Text className="text-[16px]  text-center capitalize" style={{ fontFamily: "Poppins-Black" }}>{user?.storeOwnerName}</Text>
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}>{user?.storeMobileNo}</Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>

             <View className="px-[32px] flex flex-col gap-[40px]">
               
                    <TouchableOpacity onPress={()=>navigation.navigate("about")}>
                        <View className="flex flex-row justify-between items-center">
                        <Text className="text-[15px]" style={{ fontFamily: "Poppins-Regular" }}>
                            About CulturTap Genie 
                        </Text>
                        <FontAwesome6 name="arrow-right" size={15} color="black" />

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("termsandconditions")}>
                        <View className="flex flex-row justify-between items-center">
                        <Text className="text-[15px]" style={{ fontFamily: "Poppins-Regular" }}>
                        Terms & Conditions 
                        </Text>
                        <FontAwesome6 name="arrow-right" size={15} color="black" />

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("help")}>
                        <View className="flex flex-row justify-between items-center">
                        <Text className="text-[15px]" style={{ fontFamily: "Poppins-Regular" }}>
                        Need any Help ? 
                        </Text>
                        <FontAwesome6 name="arrow-right" size={15} color="black" />

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={deleteUserData}>
                        <View className="flex flex-row justify-between items-center">
                        <Text className="text-[15px]" style={{ fontFamily: "Poppins-Regular" }}>
                        Log Out
                        </Text>
                        <FontAwesome6 name="arrow-right" size={15} color="black" />
                        </View>
                    </TouchableOpacity>
                    
        
             </View>
             
             <View className="absolute flex justify-center items-center">
            
          <ModalLogout
            user={user}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            
          />
          
        </View>
        {modalVisible && (
                    <View style={styles.overlay} />
                )}
         </View>
      
    </View>
  )
}

export default MenuScreen

const styles = StyleSheet.create({
    overlay: {
        flex:1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent greyish background
    },
 
})