import firebase from 'firebase/app';
import config from './firebaseConfig';

function loadFirebase(): firebase.app.App {
  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.analytics();
  firebaseApp.performance();
  return firebaseApp;
}

export { loadFirebase };
