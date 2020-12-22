import { h, JSX, Fragment } from "preact";
import {
  Header,
  Footer,
  InstructionsPanel,
  ValueBar,
  SznGrid,
  ConsentBanner,
} from "./components";
import { categories } from "./categories";

export const Home = ({ preloads }: { preloads: JSX.Element }) => {
  return (
    <html lang="en">
      <head>
        <title>Perfect SZN</title>
        <meta name="description" content="Perfect SZN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/assets/icons/96x96.png" />
        <link rel="icon" type="image/png" sizes="196x196" href="/assets/icons/196x196.png" />
        <link rel="apple-touch-icon" href="180x180.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/icons/152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/assets/icons/167x167.png" />
        <link rel="preload" href="/assets/Arvo.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/assets/Karla.woff2" as="font" type="font/woff2" crossOrigin="" />
        {preloads}
        <link rel="stylesheet" href="/main.css" />
        <script type="module" src="/js/index.js"></script>
      </head>

      <body class="font-body">

        <ConsentBanner />

        <Header />

        <InstructionsPanel />

        <section class="szn-sticky-bar">
          <ValueBar />

          <div class="szn-button-bar grid grid-flow-col gap-x-4">
            <button disabled={true} id="szn-reset-button" class="szn-outline-button szn-outline-button--filled">
              Reset
            </button>
            <button disabled={true} id="szn-submit-button" class="szn-submit-button">
              Submit
            </button>
          </div>
          <button id="szn-submit-button--hidden" class="hidden">You should not see this hack</button>

        </section>

        <SznGrid categories={categories} />

        <div class="szn-fullbleed py-32">
          <svg viewBox="0 0 1438 173" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="11.808%" y1="49.497%" x2="93.884%" y2="50.535%" id="a"><stop stop-color="#E04733" offset="0%"/><stop stop-color="#FF6B1C" offset="20.711%"/><stop stop-color="#FFE600" offset="39.441%"/><stop stop-color="#14B045" offset="63.808%"/><stop stop-color="#0034AC" offset="82.839%"/><stop stop-color="#67318E" offset="100%"/></linearGradient></defs><path d="M0 34.641C90.25 3.065 169.917-6.925 239 4.673 486.65 46.25 572 153.514 890 167.5c165.939 7.298 351.605-12.015 557-57.938" transform="translate(2 2)" stroke="url(#a)" stroke-width="4" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>

        <div id="szn-skyline" class="szn-skyline">
          <h4 class="szn-skyline__title">Your SZN</h4>
          <div class="szn-skyline__holder">
            <img class="szn-skyline__post-card" loading="lazy" src="/assets/blank-post-card.jpg" alt="Blank Selection Card" />
            <a href="#" id="szn-skyline__holder__button" class="szn-skyline__holder__button hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#FFF"><path d="M22.3 43.5c-.6 1.5-.3 3.2.9 4.4l24 24c.8.8 1.8 1.2 2.8 1.2s2.1-.4 2.8-1.2l24-24c1.1-1.1 1.5-2.9.9-4.4-.6-1.5-2-2.5-3.7-2.5H54V14c0-2.2-1.8-4-4-4s-4 1.8-4 4v27H26c-1.7 0-3.1 1-3.7 2.5zM64.4 49L50 63.4 35.6 49h28.8zM18 88h64c2.2 0 4-1.8 4-4s-1.8-4-4-4H18c-2.2 0-4 1.8-4 4s1.8 4 4 4z"/></svg>
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
      </body>
    </html>
  );
};
