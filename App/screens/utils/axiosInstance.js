import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.86.218:5000';

// Function to get stored token
const getToken = async (key) => {
    try {
        const token = JSON.parse(await AsyncStorage.getItem(key));
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// Function to set stored token
const setToken = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting token:', error);
    }
};

// Function to refresh tokens
const refreshToken = async () => {
    try {
        console.log('hello');
        const refreshToken = await getToken('refreshToken');
        console.log(refreshToken);
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.get(`http://192.168.86.218:5000/retailer/refresh-token`, { params: { refreshToken: refreshToken } });
        // console.log(response);
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        console.log('refresh token:', accessToken, refreshToken);
        await setToken('accessToken', accessToken);
        await setToken('refreshToken', newRefreshToken);

        return response.data.accessToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = await getToken('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error('Refresh token failed:', err);
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
