import React, { ReactNode } from 'react';
import { Modal, SafeAreaView, StyleSheet, View } from 'react-native';
import Colors from '../constant/colors';

export type BaseModalProps = {
  visible: boolean;
  onRequestClose?: () => void;
  children: ReactNode;
};

const BaseModal = ({
  visible,
  onRequestClose,
  children
}: BaseModalProps) => {
  return <View
    style={[
      styles.centeredView,
    ]}
  >
    <Modal
      style={styles.modalView}
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <SafeAreaView style={[
        styles.centeredView,
        styles.backdrop
      ]}>
        {children}
      </SafeAreaView>
    </Modal>
  </View>
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    backgroundColor: '#00000066'
  },
  modalView: {
    backgroundColor: Colors.Black,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

export default BaseModal;