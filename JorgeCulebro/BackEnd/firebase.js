import { initializeApp } from 'firebase/app';
import config from './config.js';
//get firebase config
const firebase = initializeApp(config.firebaseConfig);

export default firebase;