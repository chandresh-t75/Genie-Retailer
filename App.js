import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput, Button } from 'react-native';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import GlobalNavigation from './App/navigation/appNavigation';
import './global.css';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './App/redux/store';
import { useEffect, useRef, useState } from 'react';
import navigationService from './App/navigation/navigationService';

import { useFonts } from 'expo-font';
// import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';
import { notificationListeners } from './App/notification/notificationServices';
import { getCurrentUserId } from './App/screens/utils/getCurrentUserId';







export default function App() {
  // const [userId,setUserId] = useState("")

  useEffect(() => {
    (async () => {
      // const media = await MediaLibrary.requestPermissionsAsync();
      // const notification = await Notifications.requestPermissionsAsync();
      // console.log("status notification", media,notification);

    })();
  }, []);













  let [fontsLoaded] = useFonts(
    {
      'Poppins-Regular': require('./App/assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Medium': require('./App/assets/fonts/Poppins-Medium.ttf'),
      'Poppins-SemiBold': require('./App/assets/fonts/Poppins-SemiBold.ttf'),
      'Poppins-Bold': require('./App/assets/fonts/Poppins-Bold.ttf'),
      'Poppins-ExtraBold': require('./App/assets/fonts/Poppins-ExtraBold.ttf'),
      'Poppins-Light': require('./App/assets/fonts/Poppins-Light.ttf'),
      'Poppins-ExtraLight': require('./App/assets/fonts/Poppins-ExtraLight.ttf'),
      'Poppins-Thin': require('./App/assets/fonts/Poppins-Thin.ttf'),
      'Poppins-Black': require('./App/assets/fonts/Poppins-Black.ttf'),
      'Poppins-Italic': require('./App/assets/fonts/Poppins-Italic.ttf'),

    }
  )
  // const ReduxWrapper = () => {

  //   const requestInfo = useSelector(
  //     (state) => state.requestData?.requestInfo
  //   );
  //       const chatUserId =getCurrentUserId(requestInfo);
  //       console.log("Chat User ID in App.js:", chatUserId);
  //       useEffect(() => {
  //         setUserId(chatUserId);
  //       }, [chatUserId]);

  //       return null; // This component doesn't render anything
  //     };


  useEffect(() => {

    notificationListeners();

  }, []);









  return (
    <Provider store={store}>
      <NavigationContainer ref={(ref) => navigationService.setTopLevelNavigator(ref)} >
        <GlobalNavigation />
        {/* <ReduxWrapper />  */}
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>

  );
}


