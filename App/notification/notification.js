

import axios from "axios";
import { baseUrl } from "../screens/utils/constants";



export const getAccessToken = async () => {
    try {
        // const response = await axios.get('https://genie-notifications.onrender.com/customerAccessToken');
        const response = await axios.get( `${baseUrl}/notification/customer-notify-access-token`);
        // console.log('res',response.data.accessToken);
        return response.data.accessToken;
    } catch (error) {
        console.error("Error fetching custimer access token", error);
    }
};

export const getAccessTokenRetailer = async () => {
    try {
        const response = await axios.get( `${baseUrl}/notification/retailer-notify-access-token`);
      
        // console.log('res',response.data.accessToken);
    
        return response.data.accessToken;
    } catch (error) {
        console.error("Error fetching access token", error);
    }
};