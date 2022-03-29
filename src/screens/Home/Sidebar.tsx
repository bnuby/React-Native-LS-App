import React from "react";
import { View, ScrollView, Button, FlatList } from "react-native";
import { useNavigate } from "react-router";
import ListItem from "../../components/ListItem";
import { useRoleContext } from "../../components/RoleProvider";
import Colors from "../../constant/colors";
import GroupModel from "../../models/GroupModel";

type SidebarProps = {
  toggleModal: () => void;
  groups: GroupModel[];
  selectedGroupId: string | null;
  selectGroup: (id: string)  => void;
  loading: boolean;
};

const Sidebar = (
  {
    toggleModal,
    groups,
    selectedGroupId,
    selectGroup,
    loading
  }: SidebarProps) => {

    const { isStreamer } = useRoleContext();
    const navigate = useNavigate();

  return (
    <View style={{
      backgroundColor: Colors.White,
      width: 100,
      height: '100%'
    }}>
      <Button
        disabled={loading}
        color={Colors.Green}
        title='Back'
        onPress={() => navigate('/')}
      >
    </Button>
    {
isStreamer ? (
      <Button
        disabled={loading}
        title='Add Event'
        onPress={toggleModal}
      />
      ) : null
    }
      
      <FlatList
        data={groups}
        renderItem={({item: i}) => <ListItem
          key={i.id}
          text={i.name}
          selected={i.id === selectedGroupId}
          onPress={() => selectGroup(i.id)}
        />}
        numColumns={1}
      />
      </View>
  );
};

export default Sidebar;
