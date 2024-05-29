// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        // Check if user data exists in local storage
        const userData = JSON.parse(await AsyncStorage.getItem("userData"));
        if (userData) {

          navigation.navigate("home");
         
        }
        else{
            navigation.replace('mobileNumber');
        }
      } catch (error) {
        console.error("Error checking stored user:", error);
      }
    };

    checkStoredUser();
  }, []);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
      
//     }, 3000); // Adjust as needed for your splash screen duration

//     return () => clearTimeout(timeout);
//   }, [navigation]);



  return (
    <View className="flex justify-center items-center">
      <Text>Loading...</Text>
    </View>
  );
};

export default SplashScreen;
