import firebase from 'firebase/app';
import config from './firebaseConfig';
import 'firebase/analytics';
import 'firebase/performance';

const firebaseApp = firebase.initializeApp(config);
firebaseApp.analytics();
firebaseApp.performance();

export { firebaseApp };
