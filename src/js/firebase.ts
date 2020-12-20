import firebase from 'firebase/app';
import config from './firebaseConfig';
function lazyApp({ ga }: { ga: boolean }): Promise<firebase.app.App> {
  return new Promise((resolve, reject) => {
    const firebaseApp = firebase.initializeApp(config);
    // Don't load GA for users who have opted out
    if(ga) {
      Promise.all([
        import('firebase/analytics'),
        import('firebase/performance'), 
      ]).then(() => {
        firebaseApp.analytics();
        firebaseApp.performance();
        resolve(firebaseApp);
      });
    } else {
      resolve(firebaseApp);
    }
  });
}

export { lazyApp };
