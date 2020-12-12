import { store } from './store';

const sznTopics: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.szn-topic');
const valueBar = document.querySelector('#szn-value-bar');
const valueBarCost: HTMLSpanElement | null = document.querySelector('#szn-value-bar__cost__value');
const valueBarSelected: HTMLSpanElement | null = document.querySelector('#szn-value-bar__selected');
const submitButton: HTMLButtonElement | null = document.querySelector('#szn-submit-button');
const canvas = document.querySelector('canvas')! as HTMLCanvasElement;
const skyline = document.querySelector('#szn-skyline')! as HTMLDivElement;

function renderState() {
  const state = store.getState();
  const isMaxSelection = state.selections.length === 5;
  valueBarCost!.textContent = `$${state.capLeft}`;
  valueBarSelected!.textContent = `${state.selections.length}`;
  // TODO(davideast): Turn this into a better toggle
  if(isMaxSelection) {
    submitButton!.classList.add('block');
    submitButton!.classList.remove('hidden');
  } else {
    submitButton!.classList.add('hidden');
    submitButton!.classList.remove('block');
  }
}

renderState();

store.subscribe(renderState);

submitButton!.addEventListener('click', clickEvent => {
  const svgElement = createPostCardSVG(store.getState());
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  const outerHTML = clone.outerHTML;
  let blobURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(outerHTML);
  const context = canvas!.getContext('2d');
  const image = new Image();
  const height = 512;
  const width = 1024;

  image.addEventListener('load', () => {
    canvas.width = width;
    canvas.height = height;
    context!.drawImage(image, 0, 0, width, height);
    image.classList.add('szn-skyline__post-card');
    const existingImage = skyline.querySelector('.szn-skyline__post-card');
    existingImage?.remove();
    skyline.appendChild(image);
    image.scrollIntoView();
  });
  image.src = blobURL;
});

sznTopics.forEach(sznTopic => {
  sznTopic.addEventListener('click', clickEvent => {
    const { maxSelections, selections, spent, salaryCap } = store.getState();
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

    if(isOver && !isSelected) {
      sznTopic.classList.toggle('shaker');
      valueBar!.classList.toggle('shaker');
      setTimeout(() => {
        sznTopic.classList.toggle('shaker');
        valueBar!.classList.toggle('shaker');
      }, 820);
    }
  });
});

function createPostCardSVG(state: any) {
  const svgText = createPostCardText(state);
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute('width', '1024px');
  svgElement.setAttribute('height', '512px');
  svgElement.setAttribute('viewBox', '0 0 1024 512');
  svgElement.setAttribute('version', '1.1');
  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svgElement.innerHTML = svgText;
  return svgElement;
}

function createPostCardText(state: any) {
  const { selections } = state;

  // Don't judge me for this... I don't know SVG
  const getRowOne = (text: string) => {
    const pieces = text.split(" ");
    let rowOne = "";
    let chars = 0;
    pieces.forEach(piece => {
      if(chars + piece.length <= 12) {
        rowOne = `${rowOne} ${piece}`;
      }
      chars = chars + piece.length;
    });
    return rowOne.trim();
  }

  const getRowTwo = (text: string) => {
    const rowOne = getRowOne(text);
    const removed = text.replace(rowOne, '');
    const pieces = removed.split(" ");
    let rowTwo = "";
    let chars = 0;
    pieces.forEach(piece => {
      if(chars + piece.length <= 24) {
        rowTwo = `${rowTwo} ${piece}`;
      }
      chars = chars + piece.length;
    });
    return rowTwo;
  }

  function createRowText(text: string, y: number, x = 20) {
    return `<text font-family="Karla-Regular_Bold, Karla" font-size="20" font-weight="bold" fill="#000516" x="${x}" y="${y}">${text}</text>`;
  }

  function getRows(selections: { text: string }[]) {
    return selections.map(selection => {
      const rowOne = getRowOne(selection.text);
      const rowTwo = getRowTwo(selection.text);
      const rowOneText = createRowText(rowOne, 40);
      if(rowTwo.trim() === "") {
        return rowOneText;
      } else {
        return `${rowOneText} ${createRowText(rowTwo, 72)}`;
      }
    });
  }

  const rows = getRows(selections);

  return `
  <title>perfectszn-postcard</title>
  <defs>
      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
          <stop stop-color="#0C0C0C" offset="0%"></stop>
          <stop stop-color="#292929" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="11.8076026%" y1="35.9764199%" x2="93.8839146%" y2="64.9249423%" id="linearGradient-2">
          <stop stop-color="#E04733" offset="0%"></stop>
          <stop stop-color="#FF6B1C" offset="100%"></stop>
      </linearGradient>
  </defs>
  <g id="perfectszn-postcard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <rect id="bg" fill="url(#linearGradient-1)" x="0" y="-6" width="1024" height="518"></rect>
      <g id="Callout" transform="translate(278.000000, 357.000000)">
          <text id="Create-yours" font-family="Arvo-Bold, Arvo !important" font-size="20" font-weight="bold" fill="#FFFFFF">
              <tspan x="32" y="60">CREATE YOURS</tspan>
          </text>
          <rect id="Rectangle" stroke="#FFFFFF" stroke-width="3" x="1.5" y="1.5" width="547" height="100" rx="4"></rect>
          <text id="perfectszn.app" font-family="Karla-Regular_Bold, Karla" font-size="20" font-weight="bold" fill="#FFFFFF" text-decoration="underline">
              <tspan x="377" y="60">perfectszn.app</tspan>
          </text>
      </g>
      <g id="TopicCard" transform="translate(88.000000, 238.000000)">
          <rect id="Rectangle-Copy-12" fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[0]}
      </g>
      <g id="TopicCard" transform="translate(278.000000, 238.000000)">
          <rect id="Rectangle-Copy-12" fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[1]}
      </g>
      <g id="TopicCard" transform="translate(468.000000, 238.000000)">
          <rect id="Rectangle-Copy-12" fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[2]}
      </g>
      <g id="TopicCard" transform="translate(658.000000, 238.000000)">
          <rect id="Rectangle-Copy-12" fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[3]}
      </g>
      <g id="TopicCard" transform="translate(88.000000, 357.000000)">
          <rect id="Rectangle-Copy-12" fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[4]}
      </g>
      <g id="Header" transform="translate(88.000000, 45.000000)">
          <g id="Skyline" transform="translate(524.000000, 0.000000)">
              <rect id="Rectangle" fill="#E04733" x="0" y="0" width="412" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-6" fill="#E04733" x="0" y="12" width="412" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy" fill="#FF6B1C" x="100" y="36" width="312" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-7" fill="#FF6B1C" x="100" y="24" width="312" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-2" fill="#FFE600" x="40" y="60" width="372" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-8" fill="#FFE600" x="40" y="48" width="372" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-3" fill="#14B045" x="56" y="84" width="356" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-9" fill="#14B045" x="56" y="72" width="356" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-4" fill="#0034AC" x="113" y="108" width="299" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-10" fill="#0034AC" x="113" y="96" width="299" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-5" fill="#67318E" x="186" y="120" width="226" height="4" rx="2"></rect>
              <rect id="Rectangle-Copy-11" fill="#67318E" x="186" y="132" width="226" height="4" rx="2"></rect>
          </g>
          <text id="Denver-Nuggets" font-family="Karla-Regular_Bold, Karla" font-size="24" font-weight="bold" fill="#FFFFFF">
              <tspan x="0" y="130">Denver Nuggets</tspan>
          </text>
          <text id="Perfect-SZN" font-family="Arvo-Bold, Arvo" font-size="44" font-weight="bold" fill="#FFFFFF">
              <tspan x="0" y="89">Perfect SZN</tspan>
          </text>
      </g>
  </g>`;
}