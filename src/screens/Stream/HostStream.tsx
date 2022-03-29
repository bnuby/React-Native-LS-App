import React, { useEffect, useMemo, useRef } from 'react';
import { Button, Dimensions, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useLocation, useNavigate } from 'react-router';
import { useImmer } from 'use-immer';
// @ts-ignore
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { LiveStreamMethods, LiveStreamView } from '@api.video/react-native-livestream';

import Colors from '../../constant/colors';
import GroupContentModel, { VideoStatus } from '../../models/GroupContentModel';
import { updateGroupItem } from '../../service/groupService';
import { initialChat, sendChat, subscribeChatAdded, subscribeChatValueChange } from '../../service/chatService';
import ChatboxComponent from '../../components/ChatboxComponent';
import ChatModel from '../../models/ChatModel';
import ChatComponent from '../../components/ChatComponent';

interface HostStreamState {
  content: FirebaseFirestoreTypes.DocumentSnapshot;
  chats: ChatModel[];
  showChat: boolean,
  isLive: boolean;
  isFront: boolean;
};

const HostStream = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = useRef(true);
  const [state, setState] = useImmer<HostStreamState>({
    content: location.state as FirebaseFirestoreTypes.DocumentSnapshot,
    chats: [],
    showChat: false,
    isLive: false,
    isFront: true
  })

  useEffect(() => {
    setState(draft => {
      draft.chats = [];
    })
  }, []);

  const ref = useRef<LiveStreamMethods>(null);
  const rtmps = useMemo(() => {
    if (state?.content?.data()) {
      return state.content.data()!['rtmps'];
    }
    return null;
  }, [state.content]);

  // Initial video
  const initialVideo = async (data:GroupContentModel ) => {
    const groupId = state.content.ref.parent.parent!.id;
    functions()
      .httpsCallable('ManualGenerateVideoLink')({ groupId, contentId: data.id, name: data.name })
      .then(async response => {
        // after create refetch data
        const newData = await state.content.ref.get();
        setState(draft => {
          draft.content = newData;
        })
      })
      .catch(e => {
        console.error(e);
      });
  };

  const group = useMemo(() => GroupContentModel.fromData(state.content), [state.content]);
  useEffect(() => {
    // if videoId not found create the video link
    let unsubscribe: Function | null = null
    if (!group?.videoId) {
      initialVideo(group);
    } else {
      initialChat(group.videoId);
      unsubscribe = subscribeChatAdded(group.videoId, snapshot => {
        const data = snapshot.val();
        if (!isNew.current) {
          setState(draft => {
            draft.chats.push(ChatModel.fromData(snapshot))
          })
        }
      });
      subscribeChatValueChange(group.videoId, () => {
        isNew.current = false;
        console.log('value changes');
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, [state.content, group])
  
  return <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView enabled={false}>
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
    </KeyboardAvoidingView>

    <Pressable
      style={[styles.roundButton, styles.backButton]}
      onPress={() => navigate('/home')}
      >
      <View>
        <Text style={styles.buttonText}>Back</Text>
      </View>
    </Pressable>

        {state.isLive ? 
          <ChatComponent
            chats={state.chats}
          />
        : null}

    {
      !state.showChat ? <>
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


      {
        state.isLive ? 
          <View style={styles.chatButton}>
            <Pressable
              style={[
                styles.roundButton,
                {
                  backgroundColor: Colors.Green
                }
              ]}
              onPress={() => {
                setState(draft => {
                  draft.showChat = !draft.showChat;
                })
              }}
              >
              <View>
                <Text style={styles.buttonText}>
                  Chat
                </Text>
              </View>
            </Pressable>
          </View>
        : null
      }


      <View style={styles.switchCamera}>
        <Pressable
          style={[styles.roundButton]}
          disabled={!rtmps}
          onPress={() => {
            setState(draft => {
              draft.isFront = !draft.isFront;
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
      </> : null  
    }

    {
      state.showChat ? 
      <ChatboxComponent
        onMessage={async (val) => {
          setState(draft => {
            draft.showChat = !draft.showChat;
          });
          if (val && group.videoId) {
            sendChat(group.videoId, val).then();
          }
        }}
      /> : null
    }

    


  </SafeAreaView>
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.Green,
    height: '100%'
  },
  camera: {
    width: '100%',
    height: Dimensions.get('window').height
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
  },
  chatButton: {
    position: 'absolute',
    left: 10,
    bottom: 10,
  }
})

export default HostStream;