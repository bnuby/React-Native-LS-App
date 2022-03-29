import React, { ReactNode } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import Colors from "../constant/colors";


type ContentItemProps = {
  onPress: () => void;
  width?: number,
  disabled?: boolean;
  children: ReactNode;
};

const ContentItem = ({
  onPress,
  disabled,
  children,
  width
}: ContentItemProps) => {
  
  return <View
    style={{
      width: (width || 0) - 5,
      padding: 5,
      height: 70
    }}
  >
    <TouchableNativeFeedback
      style={{
        width: '100%',
        height: '100%',
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 8,
          backgroundColor: Colors.Teal,
          paddingVertical: 10,
          paddingHorizontal: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent:'center'
        }}
      >
        {children}
    </View>
  </TouchableNativeFeedback>
  </View>
};

export default ContentItem;