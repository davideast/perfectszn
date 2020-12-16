import { h } from "preact";
import {
  Header,
  Footer,
  InstructionsPanel,
  ValueBar,
  SznGrid,
  EmbeddedStyles,
  EmbeddedScript
} from "./components";
import { categories } from "./categories";

export const Home = ({ styles, script }: { styles: string, script: string }) => {
  return (
    <html lang="en">
      <head>
        <meta name="description" content="Perfect SZN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Perfect SZN</title>
        <EmbeddedStyles styles={styles} />
      </head>

      <body class="font-body">
        <Header />

        <InstructionsPanel />

        <section class="szn-sticky-bar">
          <ValueBar />

          <button id="szn-submit-button" class="szn-submit-button uppercase font-display tracking-wider hidden">
            Submit
          </button>
          <button id="szn-submit-button--hidden" class="hidden">You should not see this hack</button>

        </section>

        <SznGrid categories={categories} />

        <div class="szn-fullbleed py-32">
          <img class="szn-skyline__wave" src="/assets/skyline-wave.svg" alt="Skyline wave" />
        </div>

        <div id="szn-skyline" class="szn-skyline">
          <h4 class="szn-skyline__title">Your SZN</h4>
          <div class="szn-skyline__holder">
            <img class="szn-skyline__post-card" src="/assets/blank-post-card.jpg" alt="Blank Selection Card" />
            <a href="#" id="szn-skyline__holder__button" class="szn-skyline__holder__button hidden">
              <img src="/assets/download.svg" alt="Download icon" />
            </a>
            <div class="szn-skyline__holder-mask">
              <span class="szn-skyline__holder-mask__heading">
                Make your picks to generate your season
              </span>
            </div>
          </div>
        </div>

        <Footer />

        <canvas class="hidden"></canvas>
        <EmbeddedScript script={script} />
      </body>
    </html>
  );
};
