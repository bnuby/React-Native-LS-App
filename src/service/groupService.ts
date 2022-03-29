// import {getFirestore, query, collection, getDocs, doc, addDoc, getDoc} from '@firebase/firestore';
import firestore, { firebase, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { groupCollection, groupContentCollection } from '../constant/collection';
import GroupContentModel, { VideoStatus } from '../models/GroupContentModel';
import GroupModel from '../models/GroupModel';

export const getGroups = () => {
  return firestore().collection(groupCollection).get().then(i => {
    return i.docs.map(GroupModel.fromData);
  })
};

export const addGroup = async (name: string) => {
  const doc = await firestore().collection(groupCollection).add({
    name,
    createdAt: new Date().toISOString(),
  });
  return doc.get();
};

export const getGroupContents = async (doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
  const result = await doc.ref.collection(groupContentCollection).get();
  return result.docs.map(GroupContentModel.fromData);
}

export const addGroupItem = async (doc: FirebaseFirestoreTypes.DocumentSnapshot, name: string) => {
  const groupContent = await doc.ref.collection(groupContentCollection).add({
    name,
    status: VideoStatus.NotConnected,
    createdAt: new Date().toISOString(),
  });
  return GroupContentModel.fromData(await groupContent.get());
}

export const updateGroupItem = async (doc: FirebaseFirestoreTypes.DocumentSnapshot, status: VideoStatus) =>
  await doc.ref.set({ status }, { merge: true });
