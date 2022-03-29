import React, { useEffect } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useImmer } from 'use-immer';
import Colors from '../constant/colors';
import BaseModal, { BaseModalProps } from './BaseModal';
import ModalHeader from './ModalHeader';

type AddGroupModalProps = Omit<BaseModalProps, 'children'> & {
  loading: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
};

type AddGroupModalState = {
  name: string;
}

const AddGroupModal = ({
  loading,
  visible,
  onSubmit,
  onClose
}: AddGroupModalProps) => {
  const [state, setState] = useImmer<AddGroupModalState>({
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
    <View style={[
      styles.columnContainer,
    ]}>
      <ModalHeader
        title='Add Group'
      />
    <View style={styles.spacing}/>
    <View style={styles.spacing}/>
      <TextInput
        placeholder='Please input'
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
    paddingTop: 0,
    paddingBottom: 15,
    borderRadius: 20,
    backgroundColor: Colors.White,
    borderColor: Colors.Grey2,
    borderWidth: 0.5,
    display: 'flex',
    flexDirection: 'column'
  },
  titleText: {
    fontSize: 14,
    color: Colors.Black,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.Black
  },
  spacing: {
    height: 5,
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

export default AddGroupModal;