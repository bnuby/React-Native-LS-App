import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import React, { useEffect, useMemo, useRef } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useLocation, useNavigate } from "react-router";
import { useImmer } from "use-immer";
import WebView from 'react-native-webview';
import GroupContentModel, { VideoStatus } from "../../../models/GroupContentModel";
import Colors from "../../../constant/colors";
import ChatComponent from "../../../components/ChatComponent";
import ChatboxComponent from "../../../components/ChatboxComponent";
import { sendChat, subscribeChatAdded, subscribeChatValueChange } from "../../../service/chatService";
import ChatModel from "../../../models/ChatModel";

const JoinStream = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const isNew = useRef(true);
  const [state, setState]  = useImmer({
    content: location.state as FirebaseFirestoreTypes.DocumentSnapshot,
    chats: [] as ChatModel[],
    isLive: true,
    showChat: false,
    videoId: null
  });
  const webRef = useRef<WebView>(null);
  const group = useMemo(() => GroupContentModel.fromData(state.content), [state.content]);

  useEffect(() => {
    setState(draft => {
      draft.chats = [];
    })
  }, []);

  const endStream = () => {
    Alert.alert("The video is already end", undefined, undefined);
    navigate('/home');
  };

  useEffect(() => {
    const unsubscribe = state.content.ref.onSnapshot({
      next: (snapshot) => {
        const data = GroupContentModel.fromData(snapshot);
        if (data.status === VideoStatus.NotConnected) {
          endStream();
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [group?.videoId])

  useEffect(() => {
    let unsubscribeChat: Function;
    if (group?.videoId) {
      unsubscribeChat = subscribeChatAdded(group.videoId, snapshot => {
        if (!isNew.current) {
        const data = snapshot.val();
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
      if(unsubscribeChat) unsubscribeChat();
    };
  }, [group.videoId])

  // fetch video id
  useEffect(() => {
    if (group.videoId) {
      fetch(`https://videodelivery.net/${group?.videoId}/lifecycle`)
        .then(res => res.json())
        .then(res => {
          if (res.live) {
            setState(draft => {
              draft.videoId = res.videoUID;
            });
          } else {
            endStream();
          }
        })
    } else {
      endStream();
    }
  }, [group?.videoId]);

  return <SafeAreaView style={styles.container}>
    {
      state.videoId ? 
        <WebView
          ref={webRef}
          originWhitelist={['*']}
          javaScriptEnabled
          mediaPlaybackRequiresUserAction={false}
          useWebView2
          source={{
            // html: `
            //   <!DOCTYPE html>
            //   <html lang="en">
            //     <head>
            //       <meta
            //         name="viewport"
            //         content="width=device-width, initial-scale=1.0"
            //       />
            //       <style>
            //         body,
            //         html {
            //           height: 100%;
            //           margin: 0;
            //           padding: 0;
            //         }

            //         #cover-video {
            //           object-fit: cover;
            //           width: 100%;
            //           height: 100%;
            //         }
            //       </style>
            //     </head>
            //     <body>
            //       <script src="https://unpkg.com/hls.js/dist/hls.min.js"></script>
            //       <video playsinline autoplay id="cover-video"></video>
            //       <script>
            //         var hls = new Hls();
            //         hls.loadSource("https://videodelivery.net/${videoId}/manifest/video.m3u8");
            //         hls.attachMedia(document.getElementById("cover-video"));

            //       </script>
            //     </body>
            //   </html>
            // `,
            html: `
            <html>
                <head>
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  />
                  <style>
                    body,
                    html {
                      height: 100%;
                      margin: 0;
                      padding: 0;
                    }

                    #stream-player {
                      object-fit: cover;
                      width: 100%;
                      height: 100%;
                    }
                  </style>
                </head>
              <body>
              <iframe
                src="https://iframe.videodelivery.net/${state.videoId}"
                style="border: none"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowfullscreen="true"
                id="stream-player"
              ></iframe>
              </body>

              <script src="https://embed.videodelivery.net/embed/sdk.latest.js"></script>

              <!-- Your JavaScript code below-->
              <script>
                const player = Stream(document.getElementById('stream-player'));
                player.addEventListener('play', () => {
                  console.log('playing!');
                });
                player.controls = false;
                player.muted = false;
                player.play().catch(() => {
                  player.play();
                });

                let timeout;

                player.addEventListener('stalled', () => {
                  window.ReactNativeWebView.postMessage('stalled');
                })

                player.addEventListener('suspend', () => {
                  window.ReactNativeWebView.postMessage('suspend');
                })

                player.addEventListener('playing', () => {
                  window.ReactNativeWebView.postMessage('playing');
                })

                player.addEventListener('waiting', () => {
                  window.ReactNativeWebView.postMessage('waiting');
                  timeout = setTimeout(() => {
                    window.ReactNativeWebView.postMessage('timeout');
                  }, 10000);
                })

                window.ReactNativeWebView.postMessage(player.addEventListener)
              </script>
              </html>
            `
          }}
          onMessage={(e) => {
            switch (e.nativeEvent.data) {
              case 'timeout':
                endStream();
                break;
              default: 
                console.log(e.nativeEvent.data);
            }
          }}
          style={styles.player}
        />
      : <View style={styles.centerView}>
        <Text style={{
          color: Colors.Black
        }}>Loading</Text>
      </View>
    }


    {state.isLive ? 
      <ChatComponent
        chats={state.chats}
      />
    : null}


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


  <Pressable
      style={[styles.roundButton, styles.backButton]}
      onPress={() => navigate('/home')}
      >
      <View>
        <Text style={styles.buttonText}>Back</Text>
      </View>
    </Pressable>
  </SafeAreaView>
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: "100%",
    backgroundColor: Colors.White
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
  player: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.Grey
  },
  centerView: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatButton: {
    position: 'absolute',
    left: 10,
    bottom: 10,
  }
})

export default JoinStream;