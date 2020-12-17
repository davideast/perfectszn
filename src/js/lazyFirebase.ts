type FirebaseApp = import('firebase/app').default.app.App;

export function lazyFirebase() {
  let _firebaseApp: FirebaseApp | null = null;
  const cachedFirebase = new Promise<FirebaseApp>((resolve, reject) => {
    if(_firebaseApp != null) { 
      resolve(_firebaseApp); 
    } else {
      import('./firebase').then(module => {
        const { firebaseApp } = module; 
        _firebaseApp = firebaseApp;
        resolve(_firebaseApp);
      });
    }
  });
  return {
    logEvent(eventName: any, eventParams?: any) {
      cachedFirebase.then(firebaseApp => {
        firebaseApp.analytics().logEvent(eventName, eventParams);
      });
    }
  }
}
