import io from 'socket.io-client';
import { baseUrl } from '../constants';

export const socket = io(`${baseUrl}/`);
// export const socket = io('http://192.168.85.192:5000/');

