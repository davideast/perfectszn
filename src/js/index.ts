import { store } from './store';

const sznTopics: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.szn-topic');
const valueBarCost: HTMLSpanElement | null = document.querySelector('#szn-value-bar__cost__value');
const valueBarSelected: HTMLSpanElement | null = document.querySelector('#szn-value-bar__selected');

function renderState() {
  const state = store.getState();
  valueBarCost!.textContent = `$${state.capLeft}`;
  valueBarSelected!.textContent = `${state.selections.length}`;
}

renderState();

store.subscribe(renderState);

sznTopics.forEach(sznTopic => {
  sznTopic.addEventListener('click', clickEvent => {
    const { maxSelections, selections, spent, capLeft, salaryCap } = store.getState();
    const id = sznTopic.id;
    const { category, cost } = sznTopic.dataset;
    const text = sznTopic.textContent;

    const potentialSpent = spent + parseInt(cost!, 10);
    const isOverTheCap = potentialSpent > salaryCap;
    const isOverSelectionMax = selections.length >= maxSelections;
    const isOver = isOverSelectionMax || isOverTheCap;
    const isSelected = !!selections.find(s => s.id === id);

    if(!isOver || isSelected) {
      sznTopic.classList.toggle('szn-topic--active');
      store.dispatch({
        type: 'TOGGLE_SELECTION',
        value: { id, category, text, cost },
      });
    }
  });
});

