import { localBoolStore } from './localStore';
import { lazyFirebase } from './lazyFirebase';

let enabledStore = localBoolStore('SZN_GA_ENABLED');
let bannerStore = localBoolStore('SZN_BANNER_DISPLAY');
let firebaseApp = lazyFirebase();
let isEnabled = enabledStore.get();
let optButton = document.querySelector('#opt-out-button')! as HTMLButtonElement;

function disableButton() {
  optButton.textContent = 'You have opted out';
  optButton.classList.add('outline-button--disabled');
  optButton.disabled = true;
}

if (isEnabled) {
  optButton.disabled = false;
  optButton.addEventListener('click', function () {
    firebaseApp.disableAnalytics();
    // Set the local store to know GA is disabled
    enabledStore.set(false);
    bannerStore.set(false);
    disableButton();
  });
} else {
  // If they are already opted out let them know
  disableButton();
}
