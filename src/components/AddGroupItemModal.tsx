import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useImmer } from "use-immer";
import Colors from "../constant/colors";
import BaseModal, { BaseModalProps } from "./BaseModal";
import ModalHeader from "./ModalHeader";

type AddGroupItemModalProps = Omit<BaseModalProps, 'children'> & {
  onClose: () => void;
  onSubmit: (name: string) => void;
  title: string;
  loading: boolean;
}

type AddGroupItemModalState = {
  name: string
};

const AddGroupItemModal = ({
  visible,
  title,
  loading,
  onSubmit,
  onClose,
}: AddGroupItemModalProps) => {

  const [state, setState] = useImmer<AddGroupItemModalState>({
    name: '',
  });

  useEffect(() => {
    if (visible) {
      setState(draft => {
        draft.name = '';
      })
    }
  }, [visible]);

  const maxLength = 10;

  return <BaseModal
  visible={visible}
>
  <View style={styles.columnContainer}>
    <ModalHeader
      title={`Add Section (${title})`}
    />
    <View style={styles.spacing}/>
    <View style={styles.spacing}/>
    <TextInput
      placeholder='Please input item name'
      placeholderTextColor={Colors.Grey}
      style={styles.textInput}
      value={state.name}
      maxLength={maxLength}
      onChangeText={(name) => setState(draft => {
        draft.name = name;
      })}
    />
    <Text
      style={styles.helperText}
    >
      Maxlength: {maxLength}
    </Text>
    <View style={styles.spacing}/>
    <View style={styles.spacing}/>
    <View style={styles.spacing}/>
    <Pressable 
      disabled={loading}
      style={styles.submitButton}
      onPress={() => onSubmit(state.name)}
    >
      <Text style={styles.textCenter}>OK</Text>
    </Pressable>
    <View style={styles.spacing}/>
    <Pressable
      disabled={loading}
      style={styles.closeButton}
      onPress={onClose}
    >
      <Text style={[styles.closeText, styles.textCenter]}>Cancel</Text>
    </Pressable>
  </View>
</BaseModal>
};

const styles = StyleSheet.create({
  columnContainer: {
    width: 250,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
    borderRadius: 20,
    backgroundColor: Colors.White,
    borderColor: Colors.Black,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  spacing: {
    height: 5,
  },
  titleText: {
    fontSize: 14,
    color: Colors.Black,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.Black
  },
  helperText: {
    fontSize: 5
  },
  closeButton: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.Teal,
    color: Colors.Teal,
  },
  closeText: {
    color: Colors.Teal,
  },
  submitButton: {
    padding: 8,
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: Colors.Teal,
    color: Colors.White
  },
  textCenter: {
    textAlign: "center"
  },
  textInput: {
    color: Colors.Black,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderColor: Colors.Black,
    borderWidth: 1,
    borderRadius: 5,
  }
})


export default AddGroupItemModal;