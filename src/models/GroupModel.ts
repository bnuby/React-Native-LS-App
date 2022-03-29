
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import GroupContentModel from "./GroupContentModel";


class GroupModel {
  doc?: FirebaseFirestoreTypes.DocumentSnapshot;
  id: string = '';
  name: string = '';
  createdAt?: Date;
  contents: GroupContentModel[] = [];

  static fromData(data: FirebaseFirestoreTypes.DocumentSnapshot): GroupModel {
    const model = new GroupModel()
    model.doc = data;
    model.id = data.id;
    model.name = data.data()!['name'];
    model.createdAt = data.data()!['createdAt'];
    model.contents = [];
    return model;
  }

  static fakeData(): GroupModel {
    const id = Math.random().toString();
    const model = new GroupModel()
    model.id = id;
    model.name = 'test' + id;
    model.contents = [];
    return model;
  }

  toJson() {
    return {
      name: this.name,
      contents: this.contents.map(i => i.toJson()),
    }
  }
};

export default GroupModel;