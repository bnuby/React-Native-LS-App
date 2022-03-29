import React from "react";
import { Pressable, Text, View } from "react-native";
import Colors from "../constant/colors";


type ListItemProps = {
  text: string;
  selected: boolean;
  onPress: () => void
};

const ListItem = (props: ListItemProps) => {
  const {
    text,
    onPress,
    selected
  } = props;
  return <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 5,
      paddingVertical: 10,
      backgroundColor: selected ? Colors.SkyBlue : Colors.White,
      borderWidth: 1,
      borderColor: selected ? 'transparent' : Colors.SkyBlue
    }}
  >
    <Text
      style={{
        color: selected ? Colors.White : Colors.Black,
        textAlign: 'center'
      }}
    >
      {text}
    </Text>
  </Pressable>
};

export default ListItem;