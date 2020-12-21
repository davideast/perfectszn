import firebase from 'firebase/app';
import config from './firebaseConfig';
import 'firebase/analytics';
import 'firebase/performance';

function loadFirebase(): firebase.app.App {
  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.analytics();
  firebaseApp.performance();
  return firebaseApp;
}

export { loadFirebase };
