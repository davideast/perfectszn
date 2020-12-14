import { FunctionalComponent, h } from "preact";
import {
  Header,
  Footer,
  InstructionsPanel,
  ValueBar,
  SznGrid,
  TopicButton,
} from "./components";
import { categories } from "./categories";

function createMarkup() {
  return { 
    __html: `window.__SZN_DATA__ = ${JSON.stringify(categories)};` 
  };
}

export const Home: FunctionalComponent = () => {
  return (
    <html lang="en">
      <head>
        <meta name="description" content="Perfect SZN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Perfect SZN</title>
        <link rel="stylesheet" href="/main.css" />
        <script dangerouslySetInnerHTML={createMarkup()}></script>
        <script defer src="/js/index.js"></script>
      </head>

      <body class="font-body">
        <Header />

        <InstructionsPanel />

        <section class="szn-sticky-bar">
          <ValueBar />

          <button id="szn-submit-button" class="szn-submit-button uppercase font-display tracking-wider hidden">
            Submit
          </button>

        </section>
        
        <SznGrid categories={categories} />

        <div id="szn-skyline" class="szn-skyline">
          <img class="szn-skyline__wave" src="/assets/skyline-wave.svg" alt="Skyline wave" />
        </div>

        <Footer />

        <canvas class="hidden"></canvas>
      </body>
    </html>
  );
};
