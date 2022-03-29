import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export enum VideoStatus {
  Connected = 'Connected',
  NotConnected = 'Not Connected'
}

interface RTMPS {
  url: string;
  streamKey: string;
};

class GroupContentModel {
  doc?: FirebaseFirestoreTypes.DocumentSnapshot;
  id: string = '';
  name: string = '';
  status: VideoStatus = VideoStatus.NotConnected;
  videoId?: string;
  previewLink?: string;
  thumbnailUrl?: string;
  createdAt?: Date;
  rtmps?: RTMPS;

  static fromData(data: FirebaseFirestoreTypes.DocumentSnapshot): GroupContentModel {
    const model = new GroupContentModel();
    const _data = data.data()!;
    model.doc = data;
    model.id = data.id;
    model.name = _data.name;
    model.status = _data.status;
    model.videoId = _data.videoId;
    model.previewLink = _data.previewLink;
    model.thumbnailUrl = _data.thumbnailUrl;
    model.createdAt = _data.createdAt ? new Date(_data.createdAt) : undefined;
    model.rtmps = _data.rtmps;
    return model;
  }

  toJson() {
    return {
      name: this.name,
    }
  }
};

export default GroupContentModel;

