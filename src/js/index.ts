import { store } from './store';

const sznTopics = document.querySelectorAll('.szn-topic') as NodeListOf<HTMLButtonElement>;
const valueBar = document.querySelector('#szn-value-bar');
const valueBarCost: HTMLSpanElement | null = document.querySelector('#szn-value-bar__cost__value');
const valueBarSelected: HTMLSpanElement | null = document.querySelector('#szn-value-bar__selected');
const submitButton: HTMLButtonElement | null = document.querySelector('#szn-submit-button');
const submitHiddenButton = document.querySelector('#szn-submit-button--hidden')! as HTMLButtonElement;
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


// Because of the WebKit bug detailed below, we have a hidden button
// that create two clicks for the actual submit button
submitHiddenButton.addEventListener('click', clickEvent => {
  const { svgImage, width, height, context, blobURL } = createSVG(canvas, store.getState());

  svgImage.addEventListener('load', () => {
    canvas.width = width;
    canvas.height = height;
    context!.drawImage(svgImage, 0, 0, width, height);
    const pngURL = canvas.toDataURL('image/jpeg', 1.0);
    const pngImage = new Image();

    pngImage.addEventListener('load', () => {
      const existingImage = skyline.querySelector('.szn-skyline__post-card');
      pngImage.classList.add('szn-skyline__post-card');
      existingImage?.remove();
      skyline.appendChild(pngImage);
      pngImage.scrollIntoView();
    });

    pngImage.src = pngURL;
  });

  svgImage.src = blobURL;
});

submitButton!.addEventListener('click', () => {
  // Sadly, we have to initiate two seperate image creation
  // operations in WebKit. The first won't wait for the requests to finish
  // for the webfonts and the second click will cause it to work.
  // More info in this great thread: https://github.com/exupero/saveSvgAsPng/issues/223
  submitHiddenButton.click();
  submitHiddenButton.click();
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

function createSVG(canvas: HTMLCanvasElement, state: any) {
  const svgElement = createPostCardSVG(state);
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  const outerHTML = clone.outerHTML;
  let blobURL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(outerHTML);
  const context = canvas.getContext('2d');
  const svgImage = new Image();
  const height = 512 * 2;
  const width = 1024 * 2;
  return { svgImage, width, height, context, blobURL };
}

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

  return `
<style type="text/css">
	<![CDATA[
		@font-face {
			font-family: 'Arvo';
			src: url('data:application/x-font-woff2;base64,d09GMgABAAAAACmAAAwAAAAATpQAACksAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmAAg1ARCAqBgGTpcguDJgABNgIkA4ZIE4QWBCAFg0YHg18bpkCzom6zXjZEUSvWqFNI/osEnoj0eyAwSHMiHNAyVIutNQ6MUrW98mH/3QwMARgshqK8iZE8jThLeFTCUY5GIySZHZ7fZk+cLp36cQYYSIio0BYYRFoopWIiFhZG9dx0zsjV7VZ9m650leHW59A7519SYCwCW5hamUkRLz6zCGJB2k6l3KQTE9SKWQWvIJY0M/l7zz/t/ues/2cCfR9a1sfSJbyctouUdExyx4lwB+gYFIFbMmb98dC3BvuzO3OHaRZNmmiE6CmIhkgkQyaJdUrhUSlR/GZRNyTU5+k0WDdUPvHjgv9/zV77kuycP0lpUsZsgY8HVChcjbv7Bigw87IM8/OXYLLLMx9LSGqXk/0UKGVPJUogciBcWblaubJlXVXhTE/h+VxLuztvcgVM0QLLU+4LX2NyOcz8TYGzBVJVFRZQ1skT5oRapTs1xtWWqQ3IKV3OBpM1IqQ873fXmNasyXutOoYohyuliRXUfPMhAFhixwQjwOhF0QGDY0Ufw89UA2BwAVRN4wXZpJQDr8sCAQrqJGRssRFkrdviFwAMqn3m7DF6C+QBzTgMZQujIkXvnJh4pbhBmYOwljc2tXilKm0yi1DH8XF73D1ugbJB2aPQKCcUE8V30OwsBlAomDiiaJQZt4VhJzjKGmW7wHvhQmC2Ez9KY38EAJjd9l//d9Xf/ofihyIAHl5+yHjo/DDwvgwYWAUAMQBkAAAgQpb3Yxsk+FsMbAlIJEkjJCIWIFCQYF68MYXIlSdZilQ6UqHCyHSwU6JNNr0mp9x3GhSuUYRmKoWKadWpV6qFQqsitRpE6rLMcu1W6tNvwKAhlcYNGzFm1CqrrbHWCuv8Y71/bbBRjm5nVNpsi61qKG2z3Q477bJblf322Os/+0w4YNJBvQ45rFOXbj2GPHVWrz4WVjrnJIp1CQLpWQ0AAHAZAMDgJQAeA9BVAJC7ADA8DRh89b4K87yEit2HC7WppgBfEEsiq30uUliVVRnDiTrLYoUScKLFuRVHqy8RbKmHy+2S2eSiXmq/50Lqn3tDPs5L0PWZgwEIu5nnrayH8Z5MWCQFElp5Qqe/oQssWR8WXhbNi6jRbhKRQh9zdR7cL1ZRERUPIoQaYDPr8T1ZlTZxSzASUvyqbX3NGTDHgYFfIkC0qsdIUnc7jpACuErmgSHgEPSePy/wcqutoSniBFbv9XwMVGX3FesyKqSuz4d2jaqRZbz0Od+aR8aQUkXkVrW/5QzW0tA0OWppJ3HuVCfpKUdCHSXpzK58QUcxbgtcrkRRBDqBzqHPitUXQVb93RJS1Jns2MQFt7kedWl0KAxWCgzQiQxeSd61vLAhVjogOd5H6SdeiQwO1MDmcfFdB5S20BYbQQqsaOo4EVyBBlSjNtq1hpNZcYHqHfyAzva91C7E8QEppHeOy4kqgSbgCGxY1ABhsedjHUdGfjlooKhW7bJce0MhnSp1P0ciMEt9v/0BDgqHcB5g6aqk4g2CSKrGuMtnTRanalRiG4ZT0ODdrDNTZObhxB9pmUCcRUYog40nuEMVguAMAc51bPlwoh/w0LtCusjWe8rvWMzd8xmn3FWsLC4sXJLc0oLJ798mm8gweKii+44xB1dVuqum211D7PRAzR46B0Vv3iZw6stiqJlOHBXFhPEKuyerNJuNuh5H1ay0BSOQXD4X1goZHSmMmH4KGbhhxHwtSdXoan5Gl4Y9BMiHcH8gtd8L7/DssA4J42r83YHhOYAOuCAoJR25MqgYYXaYB0qttlitPXwFoaWohVqncx7NKqEDdLN6r5KUCFY2tFSCXISk8beal/tdbQEEifVSCEWfiB29GXY56D7D7yeqWRrvns3XDGuVMFI4s/3yior/EqSp3CwT6aIlQvbFEdlQuXpmluXO78sMNMfLG2Fe5c047q8p5pDZdSYHxEFYQBIQ6xqtU+lye/kGLYYaQC3TnFiGaEuvfJbzkeSdu0RwXQ62RxRsBMceZx5iFiYLbRs0EPNcpcmtw0xsRlO5DVbN5EiotTaavSMJsak84uB6A0KxJX3fKc5ArxgKhh3KSiqTQGLqJyZJUk4/0xG6mew+fcIuC6hUR7x0PtTs54FJ24zo2mpagIreZL1wZZBk7a4XBFRW3X/QF2d+CHdpEaJrBTJZuXVEj9QI7s9vNcwRz2mO4P/1Q46gQ6V38KqsVc6IQpKhFbVLXxltQ083RW/F3D24HPvfCPKssiJaZlnKCNSWi8dQ+snfhDsd9Q+3TIwc7YwK2eDJVQuXyifJ8Qd9YuygbvY6pOjEQzrs+t9ZrxHSGCxJTdWS/ArxF8eAdFpMI7mGZsxr2HhZA/xC8qUyqppzpGbMcej2JOf/mKvvc9upsn08bjuYuFYl8S6Fp850hRFhDuHRVnS6OzTpKExiZ5g5ghVb3b6RYxHpGGdHRBmfTGmuT4ZkqjEBybpjBa9TVxAnQpKWdS80gDm+l02pE1rgRnMlvXLv8a4qXHtAO3bDVS9rQM5K4nEhx+EIRmCHCZ9ipktB4pE5RgpweCdy9pk1RXWyrnaQTA/XCxa4Pn+gsM9zhBZg0CpN5h1p7Zt6BOisZBKXdHarnX2YEi4yVdRnBt+2GmpAXmu0pQxFJvuR/BGxeTota6Ar5+5MXyFnHL/C0iVMjjSfFASayXwDVnBVSlWpobLmQEU9cklvasOwzeLy3RX9EDMTeCf0fOHg8EPvhlz4yjFCAJUxsVK3whOd+TN6/hMNOYaeEYu4fTGInNSoAakwKsULjbxzCoz/kAvGERHI1WOEb9h8nxOeSfjIhFDojyQUOyiQ16Yhu89Yq38loTvDMsncSGaCBG9kdS4tvtwBR+IZkSj6qpbv2qvdiE1RLADXXndGaTdQ0LGsoRs0ecY/Kwr3ll2Jgqcf8fwaOxcyOCO8+/o2DGMub5HFISeRqiiGpcJZhB87La11mkDWAr3DSKzfT4yZ+fozR7CIz8pg/fuBJuPwAYsRmzV+UT88y6BaV82lMVSXRh472QOlTAgjYhJSk7ADZJP5RAWWr8hr2COtLk+dRoYyRmhDeKwDjY1kILwqVoyIpTbQfszJTXRqGhyfnIxOMqUfHUWSGdl6MvSybC6rEq+w0T0eaB5fZ/2MeqxGNJwQ9Ac8/nCEYDLdS4YOI0V5eZsna5/lISyGN+ICodxO8FuXA0BX1mr7f+HzqWiU3lks7dUSggZORl4kRxt6KnMB5LmVBq9GY23eclBeVa83WrikcA6J3O+yO3w6bpsQ31mqCz4QVVBv9m0y6fNbv3x9n4+sZGmJtGThq0ZWLda29oreoEGwdixAdbkzcsOhyLM47tfszIAjTcn2WN69mAl8vBzeTunbORC/7X4lpQJ3D9/auSTAbolfxAwSbSL+QHJkz8J4PFT+RL5sHHBcpr5V/4NbHHIZaiY9g1alszB5OSkn19jSTp7Ia1ioxgfCc+Cdls63lnmriDGwjC2Q+gTQjTfCd9K4tHhswvTWM8WJxIyU7Cj3QUEVokMiWbogoWzDZzHQmSpja1m7uXr8bG4xVEI+ejuLSG7QVL6GvP6uNneLBLmMGef69UXlzXBLT8+MLU1TF0X1eqcURtLgW3P9yufT6haNLAeTVuv42s/OvHZvODlZntUXk8XgYM0UmyR3uC8NyQhKKirevFm5v3LsduHLl0Ac9p/I20rDMnri1Qr9gNSyPcj96wvLiqryzFcp86wyiap4g1xqwzDubCfok+Q8F2hB4eOesHd+nCCuM7xAMnnnZBSCvCw5WaNg05iXiD/H07UcqtcxKezDjW6hU7m6FNWDld1clNnmMLmTfGyQXs/amYzI7chXGUtmqkrhdezYMeJnGOkQPChZxlTkBoC4dCvDEkn0Dm1h7rCQcEMA8PK5or9+vx5HBgfvl4A6liY2VZlkw8lWUaUT159pe12ei6Axo0tkzdCBoGJDeuP9Tqm69epiu50HguKrYB6sxW1zr4Kc2KqeMTVXYpGzdBzHkq5/dtkZkRTiTjcwkKC6jASVDhYp1MiX0dazydfsVe2K2K1vy7KfYefzuIbMxF/VOzGX0jMgOhltopxvFOsMoWXSlc7C/qvVySaX711pRiaea+aYU2NxojqFXPib4lm8L7lkM8LKuArnu1Yug+NSYMJHlfEROJ9o7TtKvYh4Pzb9hsqllFDOTOHDo5mRHw5TSvKbDa9+A0dbbyxvpv5AZh9ugucii5MOb3sQvXLLWvZuhjq6IvNcSST/z/Nc/n87Intq6GJ5bNKKOb8H9B9zZofELZgfEzZvDog6O99TGhuunuOveLBFowssT+EDytUXH2xhg9SetFIpmxMWO48/U1yqHYvKVLf75mdcfZCoV1gPFRyb0ytgo+uwJCg99tse4HzuOFpj8i7kr99MLlF07tun6EwuvX67MNXkrYmmtBZtr+Xi7gdb910OrlFlBFfvu/Rg824woXfc5Bx9dG3lajQx7hoZfaKJyqnMufbGeuYcdaBW+mI8xbnULSqrPAt8dgpeOpXxNPgcGIGzTqw7HDlw+Eimp/6AwpJYdfV+fka7r/p0VUga822P92rhLmXScoZ+sFWjC9QnxHsXHLr8KGrv/iy4aP9C6uByEH3pt9seuZZc6jaVfbXyajuVliyPW7w6sDIwWwa4hnOt14g1S720g9elTZoauvf6LgtMplhuuZgZyc3ntUPSDx31ofgw/nu6DmeEz/mx/cmrMsJ3wosXs83yNBOdCDDpxB8wOcMnTlSMlm3ecaIDno38KrS5ayXwJ094G+QJpabaJqba2D4NCMiBmIA785YNL7sVhM+7erQK8ocqTpTBT+Ppj87XAOpHpDccncaJzEz6SctbIZwyUYVimZOZGa5Y4Ekle4d3BaRUe22I13hvTK1eGqBSLWXZmRs18cwNKVjWFCcKpsQdZdLxiDS/fXVNp0Jarzi2Qfkyf129WtmS2xCXqqnILAXLF1bNvNk6ciYCdLX+3XZ5lOGqcw9aai3fnr999KPD1k841f2seeLQgiR5DVHCKnTLYmjccGbV2dNOHU7CPVXogr2CinzugCIYlecXGcXfSAhOgyto0xUGTvtYKUux0bcjkL41AQL/GtGf8FZbsN3QPHJEhaYUMNZwuJlng2xcnDimYApLTDwigbtCUXVagVhLqAnLCt29rOaMqDx8wKlKEpeMYKcQ0/yItoErw+1Z6hhZgBOM9v3VUwkbXiyKTvfoismQrl+ad4xVGDPsUi5SRWsSSWkg33z40r5p4TkVBZwTT1+6NAa1AEP3t/HwtgKVU5EgMA7tzYq344uxJdEF4/B4eEnIWNSPsY03I8vLrkWMrI/61B/fAtyPvW2BN9kobg1Y99xaDm+FrzKrizbLi94KdA1h3JYlV29tWyyvW7x6xyZLxq3+oX/NjJh8WW92lZNvVs9ZbEjdBtzXvq2DM04/P/WACtVB/a++v/zeDNVBgqkH5597wOvg/V/AJzAIYDO/tcCrTkddj1oGb4FnH9Vq90FroPUp/8Q1gMCnO8j0lk1vBBZV3iR4a/9HoU0VUAMAwFlP3Mjym7iY5bTECPdikdijJEXVS9GI8hcjUPibikAzYmwnloOOO5IkuC+p0KxxKYjnDmaXtEHbnlwW5RGr6z9aTRIENiSuLzC4bjHtEJmD9MmbUnZ0hx7TZ4cc61g+pSjwz7HC2dKBEWzZ8tfcVJanx2wak0uPwvL5+HhfP7yWJ1BjgXvturU6D5FhdyyeL8Il+HniNXxhLD7vSZD9tk37ocCFskv1aXsEBUUnVEtXhJ7Kz5NNL1t+MqzAUC4bJgqJJ4jAVWVxDBjBTkP/O0dlOzCLjis6u6XHc3NDptuXTcsLOTnWHnOXGX5Fw5A0JYaKzWJepKhxfAFe4+eLT+Dz1RgQPU3axOCJiOGWRGLogkBKZB2cebY2lhLnkL5YfONSROfKgDO5uSEnlvacUJaWToTWdAoOw7KWAZuFJX4hiNjf1ds1g/eECOCIXTRpPPn1EFQHDX4dNh7eFOXfkhbTRg72jjTj2by7m3s5vtsF+ciRhgbuZh5VeiSz+FTY8q6wY/mZIYc7uo7J84AQFCI9LcmP6iIP9paf8Mlqfi6J9Cu/x3cdp2k91FZcL1yc5MY9YbZwvsHveQUSPgAxWD4PH+3tg9fweNFYYNhrcSV1bbuP8sCxi6fy+qAL/uFKLZ+oo8Y19kHp0NjHMWA0Z9GlX12QBhp6OdQWh0OwZ9lIJ+zv2eqJwyHZs78bJzZyFvEEhoxFJ+yLmP9mZ66lpxs+FsEEB6Mce2qZALqp7QlEMnUiW/p7LK7UbBUlQ9bQ/sP3p99tItpIDwxtSIN828d1OgEj2BiUJ81zDbvotvrzKEtZuF5GVsyRBcW4JVt7HDxz6XReN3RLFqHWhnklMCjsBVaLIp5DtxQuNrwHr0PN0ogmy9ZB9dDAyz7A5CrCoxKCGDqi/dL1fLa+l73QzSg2bYwZeeDUxVNYMYBofs7uY8u6TylLSk4rrSn0WE5OyPGuHq+VV0Bb2i2PxSWHhU/gi9R4hrvaiSvCJfj44bRcgRrLpkhcvgCvBXPziWnTr2nW7rlTJaGjo+lEuTnWwifHoTXQhkPZhbb+mZwo7OdMf8GOceIJGW9/J5of1Stm+sZrSYa9d4BG9UhP5OpDptrfkUGhf5YVjkT/OACtWXzTL9nLkYNK9/ShR+F4F4+vH4r6w+J/tNsmncBbQCBqiq5Aa6DBl/3QOcmOTByH22bgA54+f7NNBfdc8q1mi/WiJAVq1wFsEryFJZdiNd6RsobGiPVuKi+1iXh6dd5uS6TxIkSmYDFeHUbC2RW7HnLehd67qjpQUFqkGiNH+2sWB08f02yxhAG7/EUXjC8Z7HY6mP5zidPIKZfD5HKcyjeLIFdQq4ACdnqFca/Bd59uQGQsev2rAtobIe2gx6hWumdnsFfrQ5ug0wmpumSlj0YS27sOwHoW2UGV6ydWTWRDdlAr4y+V8TevYqyCzOyrtbjrq+uW6dczbLP463qz524PBvzNB5vNWdWlDaU86CWUAn6/e1O6iEUuTstL84ReQLnv3/75lSI4VM1/qNCeur66SEj/6ZBjAz+0A6qDdgdP837qQMzqTTGnhozWte86Gvj8hPGVHnAWQUmztT0bDHwOQ3kQEIw72woEInsCXmjPtxPhne1FdIG9s4vQnmcrBKMmYw8K2s+zrVeN+SLarj4qW7PqYUnbJT/r0XE2ov3So5JRWmSq0LPcdGOS1nSDR2WqKCJSJ/KsNNugTTLb6FGeKgS55qNWL1ujx2e6DO6OQS2g0nChG48jqePbFZ9lIwhUsb2RjWgusTB4X3PlXo5Ou4PVnCf9Vx8p7vXlb73sTr8HiPks+41koZ0rjmtNuM71MADxoq3VDbuDs9P2ipvKgsYjNdIRPoXuyyEpEUleCdKt7fWHgvW6XZymfNnIYp0r0yj1YEK8a4BtNorj5GzLDw1GUtrNO934Vj9bwPxhx50hIY70UDbOy5Bw5f8r7UegVqirvRcgeSOfsqzZyXv8WkvDdhZWRR7urpngaBO20NqS4vvMkxjyWJykLgDpSpFiKu3lVIJD8AE5hs6JtTZeTMVP0VYB7yXvGbbj2HqFabcio9xvODJT9t/SpoNBGWkTQR31st06GlztqHKVlxauNaB7+Sa4/Tw5H4NBiMuVTiznMOQX5yAqGRs4I7cDT83TaAXpX9LeJT8mJf+zyeGp4nHBp6+w46iWsgP4b/NU9aKGkuBxdUToIJ8pZ2k2pCSEbm1vPByiD2jC5nNio7hp2CK/NO0WBYvvHbJSERO0ur50u2hevi8BI/mmRNGoCtRzjITgjBE+UzhQaUqHGYwQ64++GyNGuLiIETF/0Jj/48RIPx4y7j6gGNCQ40sSdaMyvR1Nh7aeDOpsWBetTBPjyYxz/nHLDYtGSDIVTkyXUCSbgf9FP1N2au3CIdgfp9TAx3F4GCRkNJkD63F1ACaMpYGeDYmJrUy5HGDBf8MEBnjUJyS2sZSqVqY20b2h9IodRs51sOUqcXZ2OL7MzkHGw7x/vYA9bc6CdaUNuBoKlW1M9XvAlhwHO44bK0Bh8yYIOEw9eS4s+Hx0dfJ2UV1F4EZtVcFUqsTAHOPL4fbHyzjd+dlDnGjNME+f7bNc6mWbQovkBagXfsMKxu9CMoWrcbzXSWLs/z/9L9Edhz5wkAT/BJc8o4VjU69gC5nftrgipfyvSBRdzrZ1tg1YWfgwDpjNwdwxtjcFkAXmgrPRAmujEyZGc8Dfy5qinrlJM+n4PsY51vFPMxuDEosfyT+7/qmqdv0rExU9CUwERk5B2uLHVzaqcv0/Oun7yNTHsx40+osJfQZ4peJ9cPC7j0E9Z093d59bfu6Ukc4SoHE+BP/5BZLupqcT0jMIGfdnZTrA91oArJOFMUism2hyNUZTf2PjTPL9VZTxyM6Kwn7ldpImfiulP7K8MrKPsjWuK/33/gO/Mrq0U34xns2PywIWhl6v/8q7WrZ5S/kV3teGet4Xq23ezIA/n+obZjhXCzevKzvJe1qWzDqRP7opISe0yLO2eqknP+s/aWNT4I5EjWh7deMOaTorxeqLw8F/fBL9bo6e1cNq7V0CHYpQga5Eh4ACia3ajwXz7QEwjv36AwNAUupbzJ6Oz8BsrerBNwyYF6MfMRbyMIFXUWREMZ3PL6LbUehFAj69ODKyiMG0YoZkxigGO+FBFk1hScWsEa1Ovqe/6VZw4yZ4BzDmyaFWwjzosvqKmH3wDcxSGq2RY9ePWHIIiTjYLehCu9C3oyBno1CfvoldrOf0KGhmYXZcrTzVP/9CfXXYZGfFUd9cC4hmAv+cbUYMRrWgQshuqKDmIJQbH5iKkz9FXbGQFlBDQvBxRAY6PFDwmbhiYrF0x1Xx4iMhrkVUbo706rb46T1cgdSJ5hZIYbvH/y70uZ01OTg4mXXbp6jwjs/BrKFB/STXCosUFDww4KAQQwZyclaUyPVCtdsaWWdefqdstZtavcatQ+aBAVfUJ9QBKq0RFOnsRB3XJjDWKvkk8qQwwnU8tC0nty10zDUiYty1NdRDA65EVKFWpjV0HIU721BrLDrK42e0mwc1DH0eIyeTIZ1ziVPdo5wJkwcFkgmVPmVXcGNj8M7U1OBdjQ0+vZTsg0q+BHjcfza7HmCY/fXyio7e52f0zQd8Kbi84sE+tszmPGvvfVzAvhN3gchDOOEECN9ZXP2/vwCJc+Ihyed3o69u78RHBH84wXspH+l0FDzOg8OPCZLuAgiAe3kUACFFQLIsuSu/LkKm7fO4F/WJZZsGTPJ+EsFF9nrcjfoIK4Nb5p0N3utF1YFF1xMounlXVMJC8jpgrG0YgAN4BF56CYAA11EWJOp3+/kG+voK7ygo5pgfoo+vmfC32uluHeJhzT0gmTTyLMMVAs3kcQ2Pr+ED+/HP5uBQw6Glvz7bAx8Pnb3uLFoD6qWpL/a/AggXgS/mwG3kZWPfQ/o4/1sihIY6QjaD3bRr87WDdiac5SymhOYQXGDJYfjaG2RuWlWZvomRHLfWszRTOJqaqd2dHCoQcAjBZkmB4OwBblw03X0bUYUtvc21cmNEos2YM9Xu/3llJzAkwS5pIqFrljQsi8FZxN+mHBZg1uwiquYonu3GU3koSK2indzu1UCo6i1hO2cGRqazuRAHGGvn4h6Jus+bhiiXaXANgWF6TCBZBKs5EkZ/1Pmp323AsbFiD9lvf16pQx595FNHft+yIzUiA3KgHvMHDVefcCezb0YKjoO5e478AXMv/AE+SaJHHZ9G6HkOpXn7/ch7KhodB9z6P3U+oocdqRHCKH4J1hIPUvhWiQuKo1qYfj8qgAdbcei4FMz0Zd5BuUi2ksIlHgnWfhShQc0RMHfWXoqmifG8XXIHT+tnAgcJju+w2pJ8vGyfM9E6i6PJEag9daR4htzVEY4Y+A0ArNs3sXVBrH8if7Qoe8wn+tLre2a3pAth0tAQOonDkTgs4G27ajJTlQwU88I8As6ugeqgsWdzqqaKduXuBWcPRIdbdSYmtXluitd4bkxu6UxQWWmDdC58uy8niBbjOg8xczu5LpPl8SInfBCSPvBKDY8rDJFYasBYv7b23glpZmimAWdS5d89zo/jxcnVA3Pq2jZFJ+9ax1n8nxJaQNSJzvxXzijxpSn/L3P+THdfVx+ACk64BNsGoIW2GBe23YphwVuPYBFTiSIz5IgAlAjpTLzqvVJwjSsNc1chAAXbt+3GNrAbWytGbXRR9X1WWobIC/KC2/FSAGzWbWDrSWEyUg6PQ8oOU+gpbE42RaYg5XLYZL1crqeE+9gVFHvaoRuKUtDoyKJkFCq8VQdsrw5g7WyEUx7AzOiS0IZq9wbAZpSaavexxP46HEcHuOcLOCeoKiU1j8OBplJ5mcPWVapopXI0lg/C1/woAnHUgPhA3EDpJ2zmA4zmmFwGvzqheGjo5TBwNK+k5t+uMBJKuVQ0hNblmgjnV0AlrZ9kLfmQ3+HNwV7geK00XRh1g2LwuIvId0cQSuuyQr8FRk3A5ve2/n0UBhwQecWTC23Ft0E6B92w3Gd5THWD47PyYzh2umsWS9CNH62oOf1r/ifW4LjFFEKd6eBedELV1RN6PDsn5HhH95SyoDyF+OQRtAbqAkbHu5a990/z4tJvfzBOfMEvBCYLH8fjqjFgrtHbFvgI+XLBFLejQDoao/QbrCs6JWy9TBuBWqDRE6Ov2cLm3IYgeUhFeCkwZCyo+9XOffWuMtuh5Og5YJSImZwMTVtrNtd8JcIiaw3W+BEQuqVIeRkoNk2LDPWmqXzszxcCykj9z3O+wGYtC77d1sbP+Y61Y4JInOks8UzCBvsTVTSSPdvQ4f1xO4prlFSY4cwO0LsEBjglse5YP3phj7j8DrKLddQ2ZFgcAoZX90u86hMT21hyGTRtkq8USzzqbXUrS6kigcZ8JLbJ6W1GoYobNTa28fUF22d1Q082wOzscBSZOHMSHPhe6CCOm41gXzxGRAyej6XzbdyZEabzRHcl1B5KBEePCGOREsQPY88wW4eVbOHYwvs26Amw+6kAVfny6JW5nzqvzNFN8/bSWX45fHkeSfryS8cqgcCx+uWOg3M/bD+oddF7p1su2Xp4inX0JKrcPtjdKYrHi3JyZwCsgY9yd8czxPUw3CGeG4hLXGThYLnmfyD5BFVAeyKknfQY2smrQcDoiXQV+yFT+CQExKzngZPFQ/zqgXk7b9X4sDnHOcB6XHOA1dQ0Xb7+1rxz9E4Pr4zi/sqGZ+lsbGpuikYYWo71xrc/T//M7D4Tx4kAgq8nG4PZp2Gq1mTgJu+n1U14y+g1/4JnpBhd+pLRG8zTpWQc9VF4xpQZv2Df0H14gZjmn8blgxo72XWhffVxw1XNagR9f3cQODLgJ+bvT99nWQO30CY8ZwU4s4i/OehQ1m7LakUVyBJepDEDJtqyH9/ExJ/7f2Vx81BlvRjGeYl+9/Dgo1qhVnXJdHrUnx/ecFXqYQj49kw2onbySl3laCVcTdPJdnc2TAalZRwK6miS/ZcZ6TecWd6tUJgmThlj59xm+C/scEzcFuuVcpFqPmVAUdo9wwaSqfggNiMU6cJUOGUixBiaY1B3qA1grH3bAs+Z8RqDpVHeGbCMHbdZjZBUWGoQjH9feDXCR/6/vOIk7RqtC9iKoqMwcBCIZAQG8Vj2e/fL+q7yajI4igR6vTKR22ryzotDr1MmBQ7Up+xhZMQNkwqDWMF34/AxVJhipoAucXCxi+xrdsDbRbHNf87lvsr8fCMxBeJkv6Vjve4B2HxRsuSfxqIJdq56Nbk6wku5LgH5pCy12MHJhPXp9WtnOdfH/p8BWvMrNqAPJkFJkWBJO9eUk9PLl+talNXoqpJs1pYW29fN5+5rsu8hcP1pTNgeYCwdaYre2uhoMjSSW0joGEsT1VVVdrgqAl7VsuiyuXpprqtePsDOghE2teETD2Vm7JAnY4E8FQQJw2b2nLZojIuRMf5eChJ6PHvSFeYsn4lUoFiANNyvuiAzxciTvXcW9vFoKitd0Uweco1ZfJm1dIRtzIgzZkijJSvXjOV3YhahFQ2Ck9g/aZ0CQGaGnzxppTxlt4TWLZ/rx9ojGpc1Bv3dBhahmntjJ+/nBcq+wzZn4LD0duXoeVpBeah99jyR/zYDP8o+PReuErY5RTcpOGLcvnsS5ElL5SlbXGMk0lhpMbTvj7NZ6FP0oMYdS9X6qgNSGxZsVwENed8IPOqceAyD5z21g7EQ4pJ1mCH0+7Y+XDwhAaNP6/YiNUn9Q132vnbs+M6t26nLvSdxN//atMwjEdgfGj5DJprhMdF7RvxXWDY3vrP+U9XP6n+1yKhJAXwvU/TbusIDNQnRRmuBOyfuF1lRl4C6R53I+mxajlH0s1RnrYD6nFOlN/+oJAsFYB814JshWTbDo3Wv30jnK5gmaMRD6hWrInVPAN/PfPprMXmg7kG0A30j5DZeVx6oS/7PR5NmiZbR/uBdnKnP93km88D7Die/ZffBmLeuge1N/h/MP7G+luwToQAAZjD3w2YMfHd2Jui/45g48hS5nAWSIUmjL2ZXmpwFwq0JskqUU8ZblOizJsiZLm3GFguWoghx9Z2EWF4FWVGRi60jAf0aM+9ZXr0sFht0VmSx091nRuC4AECuBSA4BoA5ADACxGXDLod07GLiXIU+yYLKVGOn8Z6WQkcmem3AmovgsyNDaO3S817GiOBb7qKnqppcCM+JsqBq+eQry9c0hLwSG7coMt9mGxYsJizanLDMyCY5k9yAovRnlhdguYc+23BzXct0SE5WSRv7tK0EV8qbOhRwow1hXHIIybvMj3zzHNXEo+64wzBGyOYC4NLm7poA7KoWvhUAtwOA5LVKci4GezKIQ2E4ZLOudMDwVT+a1/rXgFjI2GmoyIaMBn9ltMCA60zkMJ8IniyEXE+d96hmjeSsXGYhat/SP5KAYBM6b2gDqQC9pyrxVLPJgulPNkfsmeTqbMagdKxHmJuQc1s42rfNDmLfX1l13y1sa4NsVk/HTiZg5sWd772tEfTFF72EBiLFZpteGYSW53jJMufc1uT5pOjf2RmXdtwO9OLJMzexrwmcfGx/WNl/HTtRDht2OMT4DJnk90x4WcPuog16CQA5lN4EH1IvwIea172huWdmeNpvQupV8OHUgeO8xes+U9nx7ZDv8xuGze7Tw3V/tgZcRdghBtioZuwqmKk9BGZ6oX5Wp5nLr7H1AW0MJvParubMNBUsZ5ewd2JR7YUjaLC4QbJe20uYWsGolSi6MqOPfgYYzIdmrcCwt6iOxxE0WHWhwA2S0k7Wq4OUmdnK9vJcscIKK6ywAqEIDUGAAOEUN0h4WWY72Mo29jxAgAABAkTAFO06mHTeMvGnHB18IpvGw6lW+oNKXVk2K71vtI9IH330008/AwwwwCCDDDLEEENqcFi1qoaRJHOgFgnUAYCafUsYUpTzqEoHOd/PC4GARCY6oGJ2rMt4Ua07obQeOpOgBesuqDD+y242hTUevWwlcumkSJUPxZkWAQoNBRUFSoISKBxZ8ullQQmkp1dIJx8JR65Celx6GRJJnjkkpZIGs/WnIqGg8MDvxxJISiaQrYuUVJL4VR4d37cwnnMJKHFue4YkGnmJBRWlfMlMC2T3R59jlpZaiBi8cEND4D9E1FT2x2xM5JmiRJKe2MstuBa0LmUil4LOl0myuDc0ajAfyGDed5xVSTZ8WXWYJXCc4DkjcOHKDREJWc9BNHQM7jx4HuYezOLDl6FwfILj3nuSu72Q492/U05BSSVchEhqUaLFMDWJOTgLS1iyYs0GApKtOVxNhHGGI5DcUDD8+GNr0qxFq7aj3J1D2/7A9j/soEO6feBiPhRHaHMliRNPo0G9j+zYu+m9D764gqdDp3skD41573d/++yLEcMmrbHSlAKrcLxkMOOrb5YZ98ovqpxioZdA64wMp1mlu2DAoCEqV4wYVS3FVSKNN/bTSZcpQ5Yc2fLk0stXoFCRYqVKlKlQrlK1Gm891+i6i/bbFzADQ9C7O/+JXpeVnJSr0+cuSr5TkHsBAA==');
    }
    @font-face {
      font-family: 'Karla';
      src: url('data:application/x-font-woff2;base64,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');
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