import { store } from './store';

const sznTopics = document.querySelectorAll('.szn-topic') as NodeListOf<HTMLButtonElement>;
const valueBar = document.querySelector('#szn-value-bar');
const valueBarCost: HTMLSpanElement | null = document.querySelector('#szn-value-bar__cost__value');
const valueBarSelected: HTMLSpanElement | null = document.querySelector('#szn-value-bar__selected');
const submitButton: HTMLButtonElement | null = document.querySelector('#szn-submit-button');
const submitHiddenButton = document.querySelector('#szn-submit-button--hidden')! as HTMLButtonElement;
const downloadLink = document.querySelector('#szn-skyline__holder__button')! as HTMLAnchorElement;
const canvas = document.querySelector('canvas')! as HTMLCanvasElement;
const consentBanner = document.querySelector('.szn-consent-banner')! as HTMLDivElement;
const consentButton = document.querySelector('.szn-consent-banner__button')! as HTMLButtonElement;

consentButton.addEventListener('click', clickEvent => {
  store.dispatch({ type: 'DISMISS', value: true });
});

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
  if(!state.banner) {
    consentBanner.classList.add('hidden');
  } else {
    consentBanner.classList.remove('hidden');
  }
}

subscribeToState();

// Because of the WebKit bug detailed below, we have a hidden button
// that create two clicks for the actual submit button
submitHiddenButton.addEventListener('click', clickEvent => {
  getFonts().then(fonts => {
    const { svgImage, width, height, context, blobURL } = createSVG(canvas, store.getState(), fonts);

    svgImage.addEventListener('load', () => {
      canvas.width = width;
      canvas.height = height;
      context!.drawImage(svgImage, 0, 0, width, height);
      const pngURL = canvas.toDataURL('image/jpeg', 1.0);
      const pngImage = new Image();
  
      pngImage.addEventListener('load', () => {
        const existingImage = document.querySelector('.szn-skyline__post-card');
        const possibleMask = document.querySelector('.szn-skyline__holder-mask');
        const parentEl = existingImage?.parentElement;
        pngImage.classList.add('szn-skyline__post-card');
        existingImage?.remove();
        possibleMask?.remove();
        // Remove instead of toggle because the user can
        // generate an image to replace the previous one
        downloadLink.classList.remove('hidden');
        downloadLink.href= pngURL;
        downloadLink.download = "perfectszn.jpg";
        parentEl?.appendChild(pngImage);
        pngImage.scrollIntoView();
      });
  
      pngImage.src = pngURL;
    });
  
    svgImage.src = blobURL;
  });
});

submitButton!.addEventListener('click', () => {
  store.dispatch({ type: 'GENERATE' });
  // Sadly, we have to initiate two seperate image creation
  // operations in WebKit. The first won't wait for the requests to finish
  // for the webfonts and the second click will cause it to work.
  // More info in this great thread: https://github.com/exupero/saveSvgAsPng/issues/223
  submitHiddenButton.click();
  setTimeout(() => {
    submitHiddenButton.click();
  }, 250);
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

function subscribeToState() {
  // Need to call renderState at first b/c redux will not
  // fire until state has been changed.
  renderState();
  store.subscribe(renderState);
}

function createSVG(canvas: HTMLCanvasElement, state: any, fonts: string[]) {
  const svgElement = createPostCardSVG(state, fonts);
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  const outerHTML = clone.outerHTML;
  let blobURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(outerHTML);
  const context = canvas.getContext('2d');
  const svgImage = new Image();
  const height = 512 * 2;
  const width = 1024 * 2;
  return { svgImage, width, height, context, blobURL };
}

function getFonts() {
  return Promise.all([
    fetch('/assets/Arvo.txt').then(res => res.text()),
    fetch('/assets/Karla.txt').then(res => res.text()),
  ]);
}

function createPostCardSVG(state: any, fonts: string[]) {
  const svgText = createPostCardText(state, fonts);
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

function createPostCardText(state: any, fonts: string[]) {
  // 10 is super important. After 10 for the first line it starts to
  // overflow past the topic card.
  const MAX_FIRST_LINE_LENGTH = 10;
  const MAX_TOTAL_CHARS = 24;
  const { selections } = state;

  // Don't judge me for this... I don't know SVG
  // These methods below make sure that no row
  // goes beyond a certain amount of characters
  // and overflow on the card. If I actually learn
  // SVG I wouldn't have to do this.
  const getRowOne = (text: string) => {
    const pieces = text.split(" ");
    let rowOne = "";
    let chars = 0;
    pieces.forEach(piece => {
      if(chars + piece.length <= MAX_FIRST_LINE_LENGTH) {
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
      if(chars + piece.length <= MAX_TOTAL_CHARS) {
        rowTwo = `${rowTwo} ${piece}`;
      }
      chars = chars + piece.length;
    });
    return rowTwo;
  }

  function createRowText(text: string, y: number, x = 20) {
    return `<text font-family="Karla, 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica" font-size="20" font-weight="bold" fill="#000516" x="${x}" y="${y}">${text}</text>`;
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
  const ARVO_BASE64 = fonts[0];
  const KARLA_BASE64 = fonts[1];
  return `
<style type="text/css">
	<![CDATA[
		@font-face {
			font-family: 'Arvo';
			src: url('${ARVO_BASE64}');
    }
    @font-face {
      font-family: 'Karla';
      src: url('${KARLA_BASE64}');
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
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <rect fill="url(#linearGradient-1)" x="0" y="-6" width="1024" height="518"></rect>
      <g transform="translate(278.000000, 357.000000)">
          <text id="Create-yours" font-family="Arvo, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">
              <tspan x="32" y="60">CREATE YOURS</tspan>
          </text>
          <rect stroke="#FFFFFF" stroke-width="3" x="1.5" y="1.5" width="547" height="100" rx="4"></rect>
          <text font-family="Karla, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-decoration="underline">
              <tspan x="377" y="60">perfectszn.app</tspan>
          </text>
      </g>
      <g transform="translate(88.000000, 238.000000)">
          <rect id="Rectangle-Copy-12" fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[0]}
      </g>
      <g transform="translate(278.000000, 238.000000)">
          <rect id="Rectangle-Copy-12" fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[1]}
      </g>
      <g transform="translate(468.000000, 238.000000)">
          <rect id="Rectangle-Copy-12" fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[2]}
      </g>
      <g transform="translate(658.000000, 238.000000)">
          <rect fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[3]}
      </g>
      <g transform="translate(88.000000, 357.000000)">
          <rect fill="url(#linearGradient-2)" x="7" y="0" width="167" height="103" rx="4"></rect>
          <rect fill="#FFFFFF" x="0" y="0" width="170" height="100" rx="4"></rect>
          ${rows[4]}
      </g>
      <g transform="translate(88.000000, 45.000000)">
          <g transform="translate(524.000000, 0.000000)">
              <rect fill="#E04733" x="0" y="0" width="412" height="4" rx="2"></rect>
              <rect fill="#E04733" x="0" y="12" width="412" height="4" rx="2"></rect>
              <rect fill="#FF6B1C" x="100" y="36" width="312" height="4" rx="2"></rect>
              <rect fill="#FF6B1C" x="100" y="24" width="312" height="4" rx="2"></rect>
              <rect fill="#FFE600" x="40" y="60" width="372" height="4" rx="2"></rect>
              <rect fill="#FFE600" x="40" y="48" width="372" height="4" rx="2"></rect>
              <rect fill="#14B045" x="56" y="84" width="356" height="4" rx="2"></rect>
              <rect fill="#14B045" x="56" y="72" width="356" height="4" rx="2"></rect>
              <rect fill="#0034AC" x="113" y="108" width="299" height="4" rx="2"></rect>
              <rect fill="#0034AC" x="113" y="96" width="299" height="4" rx="2"></rect>
              <rect fill="#67318E" x="186" y="120" width="226" height="4" rx="2"></rect>
              <rect fill="#67318E" x="186" y="132" width="226" height="4" rx="2"></rect>
          </g>
          <text font-family="Karla, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF">
              <tspan x="0" y="130">Denver Nuggets</tspan>
          </text>
          <text font-family="Arvo, sans-serif" font-size="44" font-weight="bold" fill="#FFFFFF">
              <tspan x="0" y="89">Perfect SZN</tspan>
          </text>
      </g>
  </g>`;
}