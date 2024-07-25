import { View, Text, Pressable, ScrollView, BackHandler, TouchableOpacity, RefreshControl, StyleSheet, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Profile from "../assets/ProfileIcon.svg"
import GinieIcon from "../assets/GinieBusinessIcon.svg"
import History from "../assets/HistoryIcon.svg"
import { useFocusEffect, useIsFocused, useNavigation, useNavigationState, useRoute } from '@react-navigation/native'
import HomeScreenVerified from '../components/HomeScreenVerified'
import CompleteProfile from '../components/CompleteProfile'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setAccessToken, setUserDetails } from '../redux/reducers/storeDataSlice'
import RemainingCustomerModal from '../components/RemainingCustomerModal'
import { baseUrl } from './utils/constants'
import NetworkError from '../components/NetworkError'

 

const HomeScreen = () => {
    const navigation =useNavigation()
    const dispatch=useDispatch();
  const [modalVisible,setModalVisible]=useState(false);
  const [networkError, setNetworkError] = useState(false);

 

//   const [userData, setUserData] = useState();

//    const serviceProvider= useSelector(state => state.storeData.serviceProvider);
//   console.log("user: " ,user);
  // const [store,setStore]=useState(false)
 
// const userData= useSelector(state => state.storeData.userDetails)


const navigationState = useNavigationState(state => state);
  const isHomeScreen = navigationState.routes[navigationState.index].name === 'home';
//   console.log("userDta at home",userData);

  useEffect(() => {
    const backAction = () => {
      if (isHomeScreen) {
        BackHandler.exitApp();
        return true; 
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress', 
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [isHomeScreen]);

  

const fetchUserData = async () => {

    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    const accessToken =  JSON.parse(await AsyncStorage.getItem("accessToken"));
    // console.log(accessToken);

    try{
      if (userData) {
        dispatch(setUserDetails(userData));
        dispatch(setAccessToken(accessToken));
        // console.log('Fetched user data successfully at HomeScreen', userData);
      
        const response = await axios.get(
          `${baseUrl}/retailer/`,
          {
            params: {
              storeMobileNo: userData?.storeMobileNo
            }
    
          }
        );
        // console.log("res at compltete profile", response.data.retailer);
        if (response.status === 200) {
          const data = response.data.retailer;
          const accessToken =response.data.accessToken;
          // setNetworkError(false)
          dispatch(setUserDetails(data));
          dispatch(setAccessToken(accessToken));
          await AsyncStorage.setItem('userData', JSON.stringify(data));
          await AsyncStorage.setItem('accessToken', JSON.stringify(accessToken));
        }
      }

    }
    catch(error){
      console.log("hii network")
      // if (!error?.response?.status){
      //     setNetworkError(true);
      // }
    }
  



};



useEffect(()=>{
  // if(isFocused) {
   fetchUserData();
  }, [])



    return (
        <View className="flex-1 bg-white " >
            <ScrollView 
          >
            <View className="flex flex-col mt-[20px]  gap-[32px] ">
                <View className="flex flex-row justify-between items-center px-[32px]">
                  
                        <TouchableOpacity onPress={()=>navigation.navigate("menu")} style={{padding:8}}>
                           <View className="bg-[#FB8C00] p-[4px] rounded-full">
                            <Profile />
                            </View>
                        </TouchableOpacity>
                   
                    <GinieIcon/>
                    
                        <TouchableOpacity onPress={()=>navigation.navigate("history")} style={{padding:8}}>
                        <View className="bg-[#FB8C00] p-[4px] rounded-full">
                            <History height={28} width={28}/>
                            </View>
                        </TouchableOpacity>
                   
                    
                </View>
                {
                     <HomeScreenVerified modalVisible={modalVisible} setModalVisible={setModalVisible} />
                }
               
            


            </View>
              
            </ScrollView>
            {modalVisible && (
          <>
            <RemainingCustomerModal
              modalConfirmVisible={modalVisible}
              setModalConfirmVisible={setModalVisible}
            />
            <View style={styles.overlay} />
          </>
        )}


        </View>
    )
}

const styles = StyleSheet.create({
  overlay: {
      flex:1,
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent greyish background
  },

})

export default HomeScreen