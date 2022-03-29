// @ts-ignore
// import {getApps, initializeApp} from '@firebase/app';
import firebase from '@react-native-firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBt6FZF0nlE6ehPgzgySJIJbV2dXX2_FP0',
  authDomain: 'live-stream-demo-448f7.firebaseapp.com',
  projectId: 'live-stream-demo-448f7',
  storageBucket: 'live-stream-demo-448f7.appspot.com',
  messagingSenderId: '674409017420',
  appId: '1:674409017420:web:94f296c8ec7975ccc644e9',
  measurementId: 'G-8KM97Q81YW',
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
