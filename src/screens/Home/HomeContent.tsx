import React, { useMemo } from 'react';
import { Button, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigate } from 'react-router';
import { useImmer } from 'use-immer';
import AddGroupItemModal from '../../components/AddGroupItemModal';
import ContentItem from '../../components/ContentItem';
import { useRoleContext } from '../../components/RoleProvider';
import Colors from '../../constant/colors';
import GroupContentModel, { VideoStatus } from "../../models/GroupContentModel";
import GroupModel from '../../models/GroupModel';
import { addGroupItem } from '../../service/groupService';

type HomeContentProps = {
  group?: GroupModel,
  contents: GroupContentModel[];
  onContentClick: (d: GroupContentModel) => void;
  onAddItemClick: () => void;
  loading: boolean;
};

type HomeContentState = {
  itemWidth: number,
}

const HomeContent = ({
  group,
  contents,
  onContentClick,
  onAddItemClick,
  loading,
}: HomeContentProps) => {

  const [state, setState] = useImmer<HomeContentState>({
    itemWidth: 50,
  });

  const { isStreamer } = useRoleContext();

  const items = useMemo(() => [
      ...contents.map(content => {
        return (<ContentItem width={state.itemWidth} 
          disabled={loading}
          onPress={() => {
            onContentClick(content);
          }} 
        >
          <View style={styles.contentBox}>
            <Text>{content.name}</Text>
            <Text
              style={[
                styles.statusText,
                content.status === VideoStatus.Connected ?  styles.statusConntected : styles.statusNotConntected
              ]}
            >{content.status}</Text>
          </View>
        </ContentItem>);
      }),
  ], [loading, state.itemWidth, contents]);

  if (isStreamer) {
    items.push(
        <ContentItem width={state.itemWidth} 
          disabled={loading}
          onPress={onAddItemClick} 
        >
          <Text style={styles.buttonText} >ADD SECTION</Text>
        </ContentItem>
    )
  }

  const numColumns = 3;

  let view = <View />;

  if (group) {
    view = (
      <FlatList
      contentContainerStyle={{
          width: '100%'
      }}
      data={items}
      renderItem={({ item }) => item}
      numColumns={numColumns}
      keyExtractor={(item, index) => index.toString()}
    />
    );
    
  } else if (loading) {
    view =  <View style={styles.centerView}>
    <Text style={styles.centerText}>Loading</Text>
  </View>;
  } else {
    view = <View style={styles.centerView}>
    <Text style={styles.centerText}>Please select a event</Text>
  </View>;
  }

  return <>
  <View
    style={{
      flexGrow: 1,
      height: '100%',
      backgroundColor: Colors.White,
      borderLeftColor: Colors.Black,
      borderLeftWidth: 1
    }}
    onLayout={(event) => {
      if (event?.nativeEvent?.layout?.width) {
        setState(draft => {
          draft.itemWidth = event.nativeEvent.layout.width / numColumns;
        });
      }
    }}
  >
    {view}
  </View>
  </>
};

const styles = StyleSheet.create({
  contentBox: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusText: {
    fontSize: 9
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '700'
  },
  statusNotConntected: {
    color: Colors.Red
  },
  statusConntected: {
    color: Colors.Green
  },
  centerView: {
    height: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerText: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.Black
  }
})

export default HomeContent;