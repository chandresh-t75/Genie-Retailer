// SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken, setMobileNumber, setRefreshToken, setUniqueToken, setUserDetails } from '../redux/reducers/storeDataSlice';
import Splash from "../assets/SplashImg.svg"
import { notificationListeners } from '../notification/notificationServices';
import { setIsHome } from '../redux/reducers/requestDataSlice';


const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const opacity = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get("window");
  const { height } = Dimensions.get("window");

//   useEffect(() => {
    
//     notificationListeners();

// }, []);


  useEffect(() => {
    const animateSplash = () => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 5000, // Animation duration of 3 seconds
        useNativeDriver: true,
      }).start();
    };

    const checkStoredUser = async () => {
      try {
        // Animate the splash screen
        animateSplash();

        // Check if user data exists in local storage
        const userData = JSON.parse(await AsyncStorage.getItem("userData"));
        const accessToken = JSON.parse(await AsyncStorage.getItem("accessToken"));
            const refreshToken= JSON.parse(await AsyncStorage.getItem("refreshToken"));
            // console.log("splash",accessToken,refreshToken)
            // await AsyncStorage.removeItem('userData')
            // await AsyncStorage.removeItem('accessToken');
            // await AsyncStorage.removeItem('refreshToken');
        // const authData = JSON.parse(\await AsyncStorage.getItem("authData"));
        setTimeout(() => {
          if (userData!==null) {
            dispatch(setUserDetails(userData))
            dispatch(setAccessToken(accessToken))
            dispatch(setRefreshToken(refreshToken))
            if(userData.storeApproved){
              navigation.navigate("home", { data: "" });
              }
              else if(!userData.storeApproved){
                navigation.navigate("completeProfile");
              }

          }
          else {
            navigation.navigate('mobileNumber');
          }
          dispatch(setIsHome(true));
        }, 5000); // Delay for 3 seconds
      } catch (error) {
        console.error("Error checking stored user:", error);
      }
    };

    checkStoredUser();
  }, []);
 
  
  
     

  // useEffect(() => {
  //   const checkStoredUser = async () => {
  //     try {
  //       // Check if user data exists in local storage
  //       const userData = JSON.parse(await AsyncStorage.getItem("userData"));
  //       if (userData) {
  //           // await AsyncStorage.removeItem('userData');
  //        navigation.navigate("home",{userData: userData});
         
  //       }
  //       else{
  //           navigation.navigate('mobileNumber');
  //       }
  //     } catch (error) {
  //       console.error("Error checking stored user:", error);
  //     }
  //   };

  //   checkStoredUser();
  // }, []);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
      
//     }, 3000); // Adjust as needed for your splash screen duration

//     return () => clearTimeout(timeout);
//   }, [navigation]);



  return (
    <View className="flex justify-center items-center bg-white">
      <Animated.View style={{ opacity }}>
        <Splash width={width} />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

