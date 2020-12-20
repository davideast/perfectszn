import { createStore } from 'redux';
import { lazyFirebase } from './lazyFirebase';

function bannerConsentStore() {
  const BANNER_KEY = 'SZN_BANNER_DISPLAY';
  const isTrue = (value: any) => value == 'true';
  
  return {
    // If there is no value in local storage then it's either a first time user
    // or someone who cleared everything. Either way we have to show the banner
    // Since localStorage only can store strings, we fake a 'true' value to 
    // keep everything as if it comes from localStorage.
    get() {
      const localBannerValue = localStorage.getItem(BANNER_KEY);
      const isBannerDisplayed = localBannerValue == null ? 'true' : localBannerValue;
      return isTrue(isBannerDisplayed);
    },
    set(value: boolean) {
      localStorage.setItem(BANNER_KEY, value.toString());
    }
  };
}

const lazyApp = lazyFirebase();
const bannerConsent = bannerConsentStore();

type AppState = {
  salaryCap: number,
  spent: number,
  capLeft: number,
  selections: any[],
  maxSelections: number,
  banner: boolean,
};

const initialState: AppState = {
  salaryCap: 15,
  spent: 0,
  selections: [],
  capLeft: 15,
  maxSelections: 5,
  banner: bannerConsent.get(),
};

function addSelection(state: AppState, action: any) {
  const { cost, text, id } = action.value;
  const costNumber = parseInt(cost, 10);
  let selectionTotal = parseInt(cost, 10);
  state.selections.forEach(s => {
    selectionTotal = s.cost + selectionTotal;
  });
  let newLeft = state.salaryCap - selectionTotal;
  return {
    ...state,
    spent: selectionTotal,
    capLeft: newLeft,
    selections: [...state.selections, { id, text, cost: costNumber }]
  };
}

function removeSelection(state: AppState, action: any) {
  const { id } = action.value;
  const selections = state.selections.filter(s => s.id !== id);
  let selectionTotal = 0;
  selections.forEach(s => {
    selectionTotal = s.cost + selectionTotal;
  });
  let newLeft = state.salaryCap - selectionTotal;
  return {
    ...state,
    spent: selectionTotal,
    capLeft: newLeft,
    selections,
  };
}

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case 'TOGGLE_SELECTION': {
      const { id } = action.value;
      const isSelected = state.selections.find(s => s.id === id);
      return isSelected ?  
        removeSelection(state, action) : 
        addSelection(state, action);
    }
    case 'GENERATE': {
      lazyApp.logEvent('szn_generate', {
        salaryCap: state.salaryCap,
        spent: state.spent,
        capLeft: state.capLeft,
        maxSelections: state.maxSelections,
      });
      state.selections.forEach(selection => {
        lazyApp.logEvent('szn_selection', selection);
      });
      return state;
    }
    case 'DISMISS': {
      const isDismissed: boolean = action.value;
      const isDisplayed = !isDismissed;
      bannerConsent.set(isDisplayed);
      return {
        ...state,
        banner: isDisplayed,
      };
    }
    default:
      return state;
  }
}

export const store = createStore(reducer);
