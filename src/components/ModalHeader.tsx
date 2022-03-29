import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constant/colors";

type ModalHeaderProps = {
  title: string;
};

const ModalHeader = (props: ModalHeaderProps) => {
  const {
    title
  } = props;

  return <View
    style={styles.headerView}
  >
    <Text
      style={styles.headerText}
    >{title}</Text>
  </View>
};

const styles = StyleSheet.create({
  headerView: {
    marginLeft: -10,
    marginRight: -10,
    borderBottomColor: Colors.Black,
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    color: Colors.Black,
    fontWeight: "900",

  }
})

export default ModalHeader;