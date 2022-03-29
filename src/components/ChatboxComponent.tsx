import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useImmer } from 'use-immer';
import Colors from '../constant/colors';

type ChatComponentProps = {
  onMessage: (message: string) => void;
}


const ChatboxComponent = ({
  onMessage,
}: ChatComponentProps) => {
  const [text, setText] = useImmer('');

  return <View style={styles.container}>
    <TextInput
      style={styles.input}
      value={text}
      onChangeText={e => setText(e)}
      maxLength={40}
      autoFocus
      onSubmitEditing={() => {}}
    />
    <Pressable style={styles.sendButton} onPress={async () => {
      onMessage(text);
      if (text) {
        setText('');
      }
    }}>
      <Text>Send</Text>
    </Pressable>
  </View>
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    right: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.White,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    display: 'flex',
    flexDirection: "row"
  },
  input: {
    flexGrow: 1,
    height: 40,
    padding: 0,
    margin: 0,
    color: Colors.Black
  },
  sendButton: {
    borderRadius: 15,
    paddingHorizontal: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Teal
  }
});


export default ChatboxComponent;