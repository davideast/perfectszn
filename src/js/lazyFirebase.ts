type FirebaseApp = import('firebase/app').default.app.App;

export function lazyFirebase({ load } = { load: true }) {
  let _firebaseApp: FirebaseApp | null = null;  
  let cachedFirebase: Promise<FirebaseApp | null> = new Promise((resolve, reject) => {
    if(!load) { resolve(null) };
    if(_firebaseApp != null) {
      resolve(_firebaseApp);
    } else {
      import('./firebase').then(({ loadFirebase }) => {
        _firebaseApp = loadFirebase();  
        resolve(_firebaseApp);
      });
    }
  });
  return {
    logEvent(eventName: any, eventParams?: any) {
      if(!load) { return; }
      cachedFirebase.then(firebaseApp => {
        if(firebaseApp != null && firebaseApp.analytics != null) {
          firebaseApp.analytics().logEvent(eventName, eventParams);
        }
      });
    },
    disableAnalytics() {
      if(!load) { return; }
      cachedFirebase.then(firebaseApp => {
        if(firebaseApp != null && firebaseApp.performance != null && firebaseApp.analytics != null) {
          firebaseApp.analytics().setAnalyticsCollectionEnabled(false);
          firebaseApp.performance().dataCollectionEnabled = false;
          firebaseApp.performance().instrumentationEnabled = false;
        }
      });
    }
  }
}
