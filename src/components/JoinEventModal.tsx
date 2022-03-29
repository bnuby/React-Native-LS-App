import React from "react";
import { Button, StyleSheet, Image, View, Text } from "react-native";
import { DataTable } from 'react-native-paper';
import { useNavigate } from "react-router";
import Colors from "../constant/colors";
import GroupContentModel from "../models/GroupContentModel";
import BaseModal, { BaseModalProps } from "./BaseModal";
import ModalHeader from "./ModalHeader";
import { useRoleContext } from "./RoleProvider";

type JoinEventModalProps = Pick<BaseModalProps, 'visible'> & {
  content?: GroupContentModel;
  onClose?: () => void;
}

const JoinEventModal = ({
    visible,
    content,
    onClose
}: JoinEventModalProps) => {

  const navigate = useNavigate();
  const { isStreamer } = useRoleContext();

  if (!content) {
    return null;
  }

  return <BaseModal visible={visible}>
    <View
      style={styles.modal}
    >
      <ModalHeader
        title={`ID: ${content?.id}`}
      />
      <View
        style={styles.content}
      >
      {content.thumbnailUrl ? <Image
        style={styles.logo}
        source={{
          uri: content.thumbnailUrl
        }}
      /> : null}
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Value</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell><Text>Name</Text></DataTable.Cell>
          <DataTable.Cell>
            <Text style={styles.text}>{content.name}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell><Text>Video Id</Text></DataTable.Cell>
          <DataTable.Cell>
            <Text style={styles.text}>
              {content?.videoId || '-'}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell><Text>Preview Link</Text></DataTable.Cell>
          <DataTable.Cell>
            <Text>
              {content?.previewLink || '-'}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell><Text>CreatedAt</Text></DataTable.Cell>
          <DataTable.Cell><Text>{(content?.createdAt || '-').toString()}</Text></DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      </View>
      <View style={styles.spacing} />

      {
        isStreamer ? (
          <Button
        onPress={() => {
          navigate('/host', {
            state: content.doc
          });
        }}
        title="Host"
      />
        ) :
        <Button
          onPress={() => {
            navigate('/join', {
              state: content.doc
            });
          }}
          title="Join"
        />
      }
      
      <View style={styles.spacing} />
    <Button
        onPress={onClose}
        color={Colors.Red}
        title="Cancel"
      />
    </View>
  </BaseModal>

};

const styles = StyleSheet.create({
  modal: {
    borderRadius: 8,
    backgroundColor: Colors.White,
    borderColor: Colors.Grey2,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderWidth: 0.5,
    width: 250,
    display: 'flex',
    flexDirection: 'column'
  },
  logo: {
    margin: 5,
    borderRadius: 15,
    height: 30,
    width: 30
  },
  spacing: {
    height: 5,
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  text: {
    color: Colors.Black
  }
})

export default JoinEventModal;