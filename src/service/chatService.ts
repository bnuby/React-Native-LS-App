import { firebase, FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { firebaseConfig } from '../firebaseApp';

const database = firebase.app().database(firebaseConfig.databaseURL);

export const initialChat = (videoId: string) => {
  database.ref(`/${videoId}`).set({ test: []}, error => {
    if (error) {
      console.error('error', error);
    }
  }).then();
}

export const sendChat = (videoId: string, message: string) => {
  return database.ref(`/${videoId}`).child('/chats').push().set({
    message,
    createdAt: new Date().toISOString(),
  }, error => {
    if (error) {
      console.error('error', error);
    }
  }).then(e =>e);
};

export const subscribeChatAdded = (videoId: string, onChange: (snapshot: FirebaseDatabaseTypes.DataSnapshot) => void) => {
  const func = database.ref(`/${videoId}`).child('/chats').on('child_added', (snapshot) => {
    const data = snapshot.val();
    if (onChange) onChange(snapshot)
  });

  return () => database.ref(`/${videoId}`).child('/chats').off('child_added', func);
}

export const subscribeChatValueChange = (videoId: string, onChange: (snapshot: FirebaseDatabaseTypes.DataSnapshot) => void) => {
  database.ref(`/${videoId}`).child('/chats').once('value', (snapshot) => {
    const data = snapshot.val();
    if (onChange) onChange(snapshot)
  });
}
