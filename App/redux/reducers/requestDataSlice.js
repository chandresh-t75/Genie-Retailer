// features/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  
  newRequests: [],
  ongoingRequests:[],
  messages:[],
  requestInfo:{},
  retailerHistory:[],
  currentRequest: {},
  isHome: false,
  onlineUser: false,
};

const requestDataSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    
    
    setNewRequests: (state, action) => {
      state.newRequests = action.payload;
    },
    setOngoingRequests: (state, action) => {
        state.ongoingRequests = action.payload;
      },
      setMessages: (state, action) => {
        state.messages = action.payload;
      },
      setRequestInfo: (state, action) => {
        // console.log('Reducer updating requestInfo:', action.payload);
        state.requestInfo = action.payload;
      },
      setRetailerHistory: (state, action) => {
        state.retailerHistory = action.payload;
      },
      setIsHome: (state, action) => {
        state.isHome = action.payload;
      },
      setCurrentRequest: (state, action) => {
        state.currentRequest = action.payload;
      },
      setOnlineUser: (state, action) => {
        state.onlineUser = action.payload;
      },
      requestClear: (state) => {
        return initialState;
      }
    
  
  },
});

export const { setNewRequests,setOngoingRequests,setMessages,setRequestInfo,setRetailerHistory,requestClear,setIsHome,setCurrentRequest,setOnlineUser} = requestDataSlice.actions;
export default requestDataSlice.reducer;
