import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import React, { useMemo } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useLocation, useNavigate } from "react-router";
import { useImmer } from "use-immer";
// @ts-ignore
import Video from 'react-native-video';
// @ts-ignore
import * as NodeMediaClient from 'react-native-nodemediaclient';
import GroupContentModel from "../../models/GroupContentModel";
import Colors from "../../constant/colors";


const JoinStream = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState]  = useImmer({
    content: location.state as FirebaseFirestoreTypes.DocumentSnapshot,
    chats: [],
    isLive: false,
  });

  const rtmps = useMemo(() => {
    return {
      url: 'rtmps://live.cloudflare.com:443/live/',
      streamKey: 'fef763ed5caa5a703b926665eaff9158kc6592d6452450861ff1fc2226800ca99'
    }

    if (state?.content?.data()) {
      return state.content.data()!['rtmps'];
    }
    return null;
  }, [state.content]);

  const group = GroupContentModel.fromData(state.content);
  // const url = group?.previewLink;
  const url = "https://watch.videodelivery.net/234edd3979a3284ac94d9fc757bfd92b";

  console.log({
    'NodeMediaClient.NodePlayerView': NodeMediaClient.NodePlayerView
  });
  return <SafeAreaView>
    
    {
      rtmps?.url ? (<NodeMediaClient.NodePlayerView
        style={styles.player}
        // ref={(vp) => { this.vp = vp }}
        inputUrl={rtmps.url}
        scaleMode={"ScaleAspectFit"}
        bufferTime={300}
        maxBufferTime={1000}
        autoplay={true}
        cryptoKey={rtmps.streamKey}
      />) : null
    }
    {/* <Video
      source={{ uri: url }}
      rate={1.0}
      volume={1.0}
      muted={false}
      resizeMode="cover"
      shouldPlay
      style={styles.player}
      // Store reference
      onBuffer={(e: any) => {
        console.log('buffer', e);
      }}                // Callback when remote video is buffering
      onError={(e: any) => {
        console.error(e);
      }}  
    /> */}

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
    position: 'relative'
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
    height: '100%'
  }
})

export default JoinStream;