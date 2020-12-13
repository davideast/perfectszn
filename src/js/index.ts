import { store } from './store';

const sznTopics = document.querySelectorAll('.szn-topic') as NodeListOf<HTMLButtonElement>;
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
    return `<text font-family="Karla, sans-serif" font-size="20" font-weight="bold" fill="#000516" x="${x}" y="${y}">${text}</text>`;
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
<style type="text/css">
	<![CDATA[
		@font-face {
			font-family: 'Arvo';
			src: url('data:application/x-font-ttf;base64,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');
    }
    @font-face {
      font-family: 'Karla',
      src: url('data:application/x-font-ttf;base64,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');
    }
	]]>
</style>
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
          <text id="Create-yours" font-family="Arvo, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">
              <tspan x="32" y="60">CREATE YOURS</tspan>
          </text>
          <rect id="Rectangle" stroke="#FFFFFF" stroke-width="3" x="1.5" y="1.5" width="547" height="100" rx="4"></rect>
          <text id="perfectszn.app" font-family="Karla, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-decoration="underline">
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
          <text id="Denver-Nuggets" font-family="Karla, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF">
              <tspan x="0" y="130">Denver Nuggets</tspan>
          </text>
          <text id="Perfect-SZN" font-family="Arvo, sans-serif" font-size="44" font-weight="bold" fill="#FFFFFF">
              <tspan x="0" y="89">Perfect SZN</tspan>
          </text>
      </g>
  </g>`;
}