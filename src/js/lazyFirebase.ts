type FirebaseApp = import('firebase/app').default.app.App;

export function lazyFirebase({ ga } = { ga: true }) {
  let _firebaseApp: FirebaseApp | null = null;
  const cachedFirebase = new Promise<FirebaseApp>((resolve, reject) => {
    if(_firebaseApp != null) { 
      resolve(_firebaseApp); 
    } else {
      import('./firebase')
        .then(module => module.lazyApp({ ga }))
        .then(firebaseApp => {
          _firebaseApp = firebaseApp;
          resolve(_firebaseApp);
        });
    }
  });
  return {
    logEvent(eventName: any, eventParams?: any) {
      if(!ga) { return; }
      cachedFirebase.then(firebaseApp => {
        if(firebaseApp.analytics != null) {          
          firebaseApp.analytics().logEvent(eventName, eventParams);
        }
      });
    },
    disableAnalytics() {
      if(!ga) { return; }
      cachedFirebase.then(firebaseApp => {
        if(firebaseApp.analytics != null) { 
          firebaseApp.analytics().setAnalyticsCollectionEnabled(false);
        }
        if(firebaseApp.performance != null) {
          firebaseApp.performance().dataCollectionEnabled = false;
          firebaseApp.performance().instrumentationEnabled = false;
        }
      });
    }
  }
}
