import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Button } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import GlobalNavigation from './App/navigation/appNavigation';
import './global.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './App/redux/store';
import { useEffect,useState } from 'react';
import navigationService from './App/navigation/navigationService';

import { useFonts } from 'expo-font';




export default function App() {

  let [fontsLoaded]=useFonts(
    {
     'Poppins-Regular':require('./App/assets/fonts/Poppins-Regular.ttf'),
     'Poppins-Medium':require('./App/assets/fonts/Poppins-Medium.ttf'),
     'Poppins-SemiBold':require('./App/assets/fonts/Poppins-SemiBold.ttf'),
     'Poppins-Bold':require('./App/assets/fonts/Poppins-Bold.ttf'),
     'Poppins-ExtraBold':require('./App/assets/fonts/Poppins-ExtraBold.ttf'),
     'Poppins-Light':require('./App/assets/fonts/Poppins-Light.ttf'),
     'Poppins-ExtraLight':require('./App/assets/fonts/Poppins-ExtraLight.ttf'),
     'Poppins-Thin':require('./App/assets/fonts/Poppins-Thin.ttf'),
     'Poppins-Black':require('./App/assets/fonts/Poppins-Black.ttf'),
     'Poppins-Italic':require('./App/assets/fonts/Poppins-Italic.ttf'),
    
    }
 )



  
  
  

  return (
    <Provider store={store}>
       <NavigationContainer ref={(ref) => navigationService.setTopLevelNavigator(ref)} >
      <GlobalNavigation />

      <StatusBar style="auto" />
    </NavigationContainer>
    </Provider>
    
  );
}


