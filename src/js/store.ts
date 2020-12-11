import { createStore } from 'redux';

type AppState = {
  salaryCap: number,
  spent: number,
  capLeft: number,
  selections: any[],
  maxSelections: number,
};

const initialState: AppState = {
  salaryCap: 15,
  spent: 0,
  selections: [],
  capLeft: 15,
  maxSelections: 5,
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
    case 'TOGGLE_SELECTION':
      const { id } = action.value;
      const isSelected = state.selections.find(s => s.id === id);
      return isSelected ?  
        removeSelection(state, action) : 
        addSelection(state, action);
    default:
      return state;
  }
}

export const store = createStore(reducer);