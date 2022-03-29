import { orderBy } from 'lodash';
import React, { useMemo } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useImmer } from 'use-immer';
import Colors from '../constant/colors';
import ChatModel from "../models/ChatModel";

type ChatComponentProps = {
  chats: ChatModel[];
}

const ChatItem = (props: ChatModel) => {
  return <View style={styles.chatContainer}>
    <Text style={styles.chatText}>{props.message}</Text>
  </View>
}

const ChatComponent = ({chats}: ChatComponentProps) => {

  const [collapse, setCollapse] = useImmer(true);
  const toggle = () => setCollapse(i => !i);
  const reversedChats = useMemo(() => orderBy(chats, 'createdAt', 'desc'),[chats]);

  return <View style={[
    styles.container,
    collapse ? styles.collapseContainer : null
  ]}>
    <Pressable style={styles.toggleButton} onPress={toggle}>
      <Text style={styles.buttonText}>{
        collapse ? "Expand" : "Collapse"}</Text>
    </Pressable>
    <FlatList
      inverted
      data={reversedChats}
      numColumns={1}
      renderItem={({ item: chat }) => <ChatItem key={chat.id} {...chat}/>}
    />
  </View>
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    padding: 10,
    paddingBottom: 60,
    backgroundColor: '#0006',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    height: Dimensions.get('window').height * 0.3
  },
  collapseContainer: {
    height: Dimensions.get('window').height * 0.15
  },
  chatContainer: {
    width: '100%',
    paddingVertical: 5,
    borderBottomColor: '#0004',
    borderBottomWidth: 1,
  },
  chatText: {
    color: Colors.White
  },
  toggleButton: {
    top: -20,
    position: 'absolute',
    backgroundColor: Colors.Teal,
    paddingVertical: 2,
    width: 70,
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    elevation: 3,
  },
  buttonText: {
    textAlign: 'center'
  }
});

export default ChatComponent;