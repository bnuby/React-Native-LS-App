import {AppRegistry, Platform} from 'react-native';
import './firebaseApp';
import App from './App';
import AppJson from './app.json';
const {name: appName} = AppJson;

if (Platform.OS === 'web') {
  AppRegistry.registerComponent('App', () => App);
  AppRegistry.runApplication('App', {
    rootTag: document.getElementById('root'),
  });
} else {
  AppRegistry.registerComponent(appName, () => App);
}
