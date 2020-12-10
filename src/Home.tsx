import { FunctionalComponent, h } from "preact";
import {
  Header,
  Footer,
  InstructionsPanel,
  ValueBar,
  Scroller,
  SznGrid,
} from "./components";
import { categories } from "./categories";

function createMarkup() {
  return { 
    __html: `window.__SZN_DATA__ = ${JSON.stringify(categories)};` 
  };
}

export const Home: FunctionalComponent = () => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Perfect SZN</title>

        <script defer src="/__/firebase/8.1.2/firebase-app.js"></script>
        <script defer src="/__/firebase/8.1.2/firebase-analytics.js"></script>
        <script defer src="/__/firebase/8.1.2/firebase-performance.js"></script>
        <script defer src="/__/firebase/init.js"></script>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Arvo:wght@700&family=Karla:wght@500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/main.css" />
        <script dangerouslySetInnerHTML={createMarkup()}></script>
      </head>

      <body class="font-body">
        <Header />

        <InstructionsPanel />

        <ValueBar />

        <Scroller>
          <SznGrid categories={categories} />
        </Scroller>

        <div class="my-32">
          <img src="/assets/skyline-wave.svg" alt="Skyline wave" />
        </div>

        <Footer />
      </body>
    </html>
  );
};
