import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import { useImmer } from "use-immer";
import AddGroupItemModal from "../../components/AddGroupItemModal";
import AddGroupModal from "../../components/AddGroupModal";
import JoinEventModal from "../../components/JoinEventModal";
import GroupContentModel from "../../models/GroupContentModel";
import GroupModel from "../../models/GroupModel";
import { addGroup, addGroupItem, getGroupContents, getGroups } from "../../service/groupService";
import HomeContent from "./HomeContent";
import Sidebar from "./Sidebar";

type HomeState = {
  loading: boolean;
  groups: GroupModel[];
  selectedContents: GroupContentModel[];
  selectedGroupId: string | null;
  showModal: boolean;
  showHomeContentModal: boolean;
  showJoinEvent: boolean;
  selectedContentId: string | null;
};

const Home = () => {
  
  const [state, setState] = useImmer<HomeState>({
    loading: false,
    groups: [],
    selectedContents: [],
    selectedGroupId: null,
    showModal: false,
    showHomeContentModal: false,
    showJoinEvent: false,
    selectedContentId: null
  })

  const selectedGroup = useMemo(() => state.groups.find(i => i.id === state.selectedGroupId), [state.groups, state.selectedGroupId]);
  const selectedContent = useMemo(() => state.selectedContents.find(i => i.id === state.selectedContentId), [state.selectedContentId, state.selectedContents]);

  const selectGroup = (id: string) => 
    setState(draft => {
      draft.selectedGroupId = id;
    })

  const toggleModal = () => setState(draft => {
    draft.showModal = !draft.showModal;
  })

  const setLoading = (loading: boolean) => setState(draft => {
    draft.loading = loading;
  })

  const onContentClick = (content: GroupContentModel) => {
    setState(draft => {
      draft.selectedContentId = content.id;
    });
  };

  const onAddGroup = async (name: string) => {
    setLoading(true);
    try {
      const group = await addGroup(name);
      setState(draft => {
        draft.loading = false;
        draft.showModal = false;
        draft.groups.push(GroupModel.fromData(group));
      })
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  const onAddGroupItem = async (name: string) => {
    setLoading(true);
    if (selectedGroup) {
      try {
        const content = await addGroupItem(selectedGroup.doc!, name);
        setState(draft => {
          draft.loading = false;
          draft.showHomeContentModal = false;
          const group = draft.groups.find(g => g.id === selectedGroup.id);
          group?.contents.push(content);
          draft.selectedContents.push(content);
        })
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    // fetch groups
    getGroups().then(groups => {
      setState(draft => {
        draft.groups = groups;
      })
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedGroup && selectedGroup.doc) {
      setState(draft => {
        draft.loading = true;
      })
      getGroupContents(selectedGroup.doc!)
        .then(contents => {
          setState(draft => {
            draft.selectedContents = contents;
            draft.loading = false;
          })
        })
    }
  }, [selectedGroup]);

  return <>
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <Sidebar
          groups={state.groups}
          selectGroup={selectGroup}
          selectedGroupId={state.selectedGroupId}
          toggleModal={toggleModal}
          loading={state.loading}
      />
      <HomeContent
          loading={state.loading}
          group={selectedGroup}
          contents={state.selectedContents}
          onContentClick={onContentClick}
          onAddItemClick={() => setState(draft => {
            draft.showHomeContentModal = true;
          })}
      />
    </View>
    
    
      <AddGroupModal
        visible={state.showModal}
        loading={state.loading}
        onClose={() => setState(draft => {
          draft.showModal = false;
        })}
        onSubmit={(name) => onAddGroup(name)}
      />

      <AddGroupItemModal
        loading={state.loading}
        title={selectedGroup?.name || ''}
        visible={state.showHomeContentModal}
        onSubmit={(name) => onAddGroupItem(name)}
        onClose={() => setState(draft => {
          draft.showHomeContentModal = false;
        })}
      />

      <JoinEventModal
        visible={!!selectedContent}
        content={selectedContent}
        onClose={() => {
          setState(draft => {
            draft.selectedContentId = null;
          })
        }}
      />
    </>
};

export default Home;