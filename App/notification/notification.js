// import { GoogleAuth } from 'google-auth-library';
// import fetch from 'node-fetch';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

import axios from "axios";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);


// export const getAccessToken = async () => {
//     const auth = new GoogleAuth({
//       keyFile: path.join(__dirname, 'genie-retailer-firebase-adminsdk-1o96w-d29171fe87.json'), // Path to your service account key file
//       scopes: ['https://www.googleapis.com/auth/firebase.messaging']
//     });
  
//     const client = await auth.getClient();
//     const accessToken = await client.getAccessToken();
//     console.log("access",accessToken);
//     return accessToken.token;
//   };
// import { GoogleAuth } from 'google-auth-library';
// import fetch from 'node-fetch';
// import { Platform } from 'react-native';
// import RNFS from 'react-native-fs';

// const __dirname = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;

// export const getAccessToken = async () => {
//     const auth = new GoogleAuth({
//         keyFile: `../../genie-retailer-firebase-adminsdk-1o96w-d29171fe87.json`, // Path to your service account key file
//         scopes: ['https://www.googleapis.com/auth/firebase.messaging']
//     });

//     const client = await auth.getClient();
//     const accessToken = await client.getAccessToken();
//     console.log("access", accessToken);
//     return accessToken.token;
// };

export const getAccessToken = async () => {
    try {
        const response = await axios.get('https://genie-notifications.onrender.com/customerAccessToken');
        // const data = await response.json();
        // console.log("access frontend", data.accessToken);
        // console.log('res',response.data.accessToken);
        // return response.data.acces 
        return response.data.accessToken;
    } catch (error) {
        console.error("Error fetching custimer access token", error);
    }
};

export const getAccessTokenRetailer = async () => {
    try {
        const response = await axios.get('https://genie-notifications.onrender.com/retailerAccessToken');
        // const data = await response.json();
        // console.log("access frontend", data.accessToken);
        // console.log('res',response.data.accessToken);
        // return response.data.acces 
        return response.data.accessToken;
    } catch (error) {
        console.error("Error fetching access token", error);
    }
};