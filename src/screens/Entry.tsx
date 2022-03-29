import React from "react"
import { Button, Pressable, SafeAreaView, StyleSheet, Text, Touchable, View } from "react-native";
import { useNavigate } from "react-router";
import { RoleType, useRoleContext } from "../components/RoleProvider";
import Colors from "../constant/colors";



const Entry = () => {

  const navigate = useNavigate();
  const {
    role,
    setRole
  } = useRoleContext();

  return <SafeAreaView style={styles.flexBox}>
    <Pressable
      onPress={() => {
        setRole(RoleType.Streamer);
        navigate('/home');
      }}
    >
      <View style={styles.textButton}>
        <Text style={styles.buttonText}>
          Streamer
        </Text>
      </View>
    </Pressable>
    <Pressable
      onPress={() => {
        setRole(RoleType.Viewer);
        navigate('/home');
      }}
    >
      <View style={styles.textButton}>
        <Text style={styles.buttonText}>
        Viewer
        </Text>
      </View>
    </Pressable>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  flexBox: {
    display: 'flex',
    paddingHorizontal: 40,
    backgroundColor: Colors.White,
    justifyContent: 'space-around',
    height: '100%',
    width: '100%'
  },
  textButton: {
    padding: 20,
    backgroundColor: Colors.Blue,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 8
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 20
  }
})

export default Entry;