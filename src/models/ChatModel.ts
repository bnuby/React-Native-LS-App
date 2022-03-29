import { FirebaseDatabaseTypes } from "@react-native-firebase/database";

export default class ChatModel {
  id: string = '';
  message: string = '';
  createdAt: Date | null = null;

  static fromData(snapshot: FirebaseDatabaseTypes.DataSnapshot): ChatModel {
    const model = new ChatModel();
    model.id = snapshot.key || '';
    model.message = snapshot.val()['message'];
    model.createdAt = new Date(snapshot.val()['createdAt']);
    return model;
  }
}