import io from 'socket.io-client';
import { baseUrl } from '../constants';

export const socket = io(`${baseUrl}/`,{
    reconnection:true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax:1000,
});
// export const socket = io('http://192.168.85.192:5000/');

