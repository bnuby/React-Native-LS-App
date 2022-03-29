import React, { useEffect, useMemo, useRef } from 'react';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useLocation, useNavigate } from 'react-router';
import { useImmer } from 'use-immer';
// @ts-ignore
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { LiveStreamMethods, LiveStreamView } from '@api.video/react-native-livestream';

import Colors from '../../constant/colors';
import GroupContentModel, { VideoStatus } from '../../models/GroupContentModel';
import { updateGroupItem } from '../../service/groupService';

interface HostStreamState {
  content: FirebaseFirestoreTypes.DocumentSnapshot;
  chats: string[];
  isLive: boolean;
  isFront: boolean;
};

const HostStream = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useImmer<HostStreamState>({
    content: location.state as FirebaseFirestoreTypes.DocumentSnapshot,
    chats: [],
    isLive: false,
    isFront: true
  })
  // const vb = useRef<any>();

  const ref = useRef<LiveStreamMethods>(null);

  const rtmps = useMemo(() => {
    if (state?.content?.data()) {
      return state.content.data()!['rtmps'];
    }
    return null;
  }, [state.content]);

  const initialVideo = async (data:GroupContentModel ) => {
    const groupId = state.content.ref.parent.parent!.id;
    functions()
      .httpsCallable('ManualGenerateVideoLink')({ groupId, contentId: data.id, name: data.name })
      .then(async response => {
        // after create refetch data
        console.log(response);
        const newData = await state.content.ref.get();
        setState(draft => {
          draft.content = newData;
        })
      })
      .catch(e => {
        console.error(e);
      });
  };
  console.log({
    rtmps
  });

  useEffect(() => {
    // if videoId not found create the video link
    const data = GroupContentModel.fromData(state.content);
    if (!data.videoId) {
      initialVideo(data);
    }
  }, [state.content])
  
  return <SafeAreaView style={styles.container}>
    <View>

      <LiveStreamView
          style={styles.camera}
          ref={ref}
          camera={state.isFront ? 'front' : 'back'}
          video={{
            fps: 30,
            resolution: '720p',
            bitrate: 2*1024*1024, // # 2 Mbps
          }}
          audio={{
            bitrate: 128000,
            sampleRate: 44100,
            isStereo: true,
          }}
          isMuted={false}
          onConnectionSuccess={() => {
            //do what you want
          }}
          onConnectionFailed={(e) => {
            //do what you want
          }}
          onDisconnect={() => {
            //do what you want
            console.log('not connected');
          }}
        />
    </View>
    <Pressable
      style={[styles.roundButton, styles.backButton]}
      onPress={() => navigate('/home')}
      >
      <View>
        <Text style={styles.buttonText}>Back</Text>
      </View>
    </Pressable>

    <View style={styles.streamButtonBlock}>
      <Pressable
        style={[
          styles.roundButton,
          state.isLive ? styles.stopStreamButton : styles.streamButton
        ]}
        onPress={() => {
          if (ref.current) {
            setState(draft => {
              draft.isLive = !draft.isLive;
              let result;
              if (draft.isLive) {
                ref.current?.startStreaming(rtmps.streamKey, rtmps.url);
                updateGroupItem(draft.content as any, VideoStatus.Connected);
              } else {
                ref.current?.stopStreaming();
                updateGroupItem(draft.content as any, VideoStatus.NotConnected);
              }
            })
          }
        }}
        >
        <View>
          <Text style={styles.buttonText}>
            {
              state.isLive ? "Stop": "Start"
            }
          </Text>
        </View>
      </Pressable>
    </View>


    <View style={styles.switchCamera}>
      <Pressable
        style={[styles.roundButton]}
        disabled={!rtmps}
        onPress={() => {
          setState(draft => {
            draft.isFront = !draft.isFront;
            // vb.current.switchCamera();
          })
        }}
        >
        <View>
          <Text style={styles.buttonText}>
            {
              state.isFront ? "Front": "Back"
            }
          </Text>
        </View>
      </Pressable>
</View>

  </SafeAreaView>
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.White,
    height: '100%'
  },
  camera: {
    width: '100%',
    height: '100%'
  },
  roundButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: Colors.Teal,
    borderRadius: 25
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  buttonText: {
    color: Colors.White,
    fontWeight: "700"
  },
  streamButtonBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  streamButton: {
  },
  stopStreamButton: {
    backgroundColor: Colors.Red
  },
  switchCamera: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  }
})

export default HostStream;