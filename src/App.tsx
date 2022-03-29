/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  Button,
  Keyboard,
  Permission,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Switch } from 'react-native';
import { NativeRouter, Route, Routes } from 'react-router-native';
import {check, checkMultiple, PERMISSIONS, request, requestMultiple, RESULTS} from 'react-native-permissions';
import { useImmer } from 'use-immer';
import ListItem from './components/ListItem';
import Colors from './constant/colors';
import GroupModel from './models/GroupModel';
import ROUTES from './routes';
import { getGroups } from './service/groupService';
import { RoleProvider } from './components/RoleProvider';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = {
    color: isDarkMode ? Colors.White : Colors.Black
  };
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, textColor]}>{title}</Text>
      <Text style={[styles.sectionDescription, textColor]}>{children}</Text>
    </View>
  );
};

const requestPermissions = () => {
requestMultiple([
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.RECORD_AUDIO,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
])
  .then(result => {
    Object.entries(result).map((params: unknown) => {
      const [key, permission] = params as [Permission, string];
      switch (permission) {
        case RESULTS.UNAVAILABLE:
          console.log(permission, 'This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log(permission, 'The permission has not been requested / is denied but requestable');
          break;
        case RESULTS.LIMITED:
          console.log(permission, 'The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log(permission, 'The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log(permission, 'The permission is denied and not requestable anymore');
          break;
      }
    })
  })
}

const checkPermission = () => {
  checkMultiple([
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ])
  .then(async (result) => {
    Object.entries(result).map((params: unknown) => {
      const [key, permission] = params as [Permission, string];
      switch (permission) {
        case RESULTS.UNAVAILABLE:
          console.log(permission, 'This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log(permission, 'The permission has not been requested / is denied but requestable');
          requestPermissions();
          break;
        case RESULTS.LIMITED:
          console.log(permission, 'The permission is limited: some actions are possible');
          requestPermissions();
          break;
        case RESULTS.GRANTED:
          console.log(permission, 'The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log(permission, 'The permission is denied and not requestable anymore');
          break;
      }
    })
  })
  .catch((error) => {
    // …
    console.error(error);
  });
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.Black : Colors.White,
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <SafeAreaView style={[
      backgroundStyle,
      { height: '100%' }
    ]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RoleProvider>
        <View 
          style={{
            height: '100%'
          }}
          >
            <NativeRouter>
              {/* <Switch> */}

                <Routes>
                  {ROUTES.map(r => (
                    <Route key={r.path} {...r} />
                  ))}

                </Routes>
              {/* </Switch> */}
      </NativeRouter>
        </View>
      </RoleProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
