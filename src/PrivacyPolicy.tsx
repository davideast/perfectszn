import { h, FunctionalComponent } from 'preact';
import { EmbeddedStyles } from './components';
export const PrivacyPolicy: FunctionalComponent = () => {
  const TwitterLink = () => <a class="underline" href="https://twitter.com/_davideast" rel="noopener" target="blank">@_davideast</a>;
  return (
    <html lang="en">
      <head>
        <meta name="description" content="Perfect SZN" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Perfect SZN - Privacy Policy</title>
        <link rel="stylesheet" href="/main.css" />
        <script type="module" src="/js/privacy.js"></script>
      </head>

      <body class="font-body text-white">

        <main class="narrow-container">

          <article class="policy-grid">

            <header>
              <a href="/" class="text-orange underline uppercase font-display">Go back</a>
            </header>

            <h1 class="text-4xl font-display my-8">
              Privacy Policy
            </h1>

            <section>
              <h2>Summary</h2>
              <p>
                This site is a fun basketball prediction game. It's a fun personal project by <TwitterLink />. Anonymous session data is collected with Google Analytics. The information collected is primarily is your country, time visited, and the selections you made for the game. The visit information is collected to gain insight into how many people who are using the site. The selection information is collected to run analysis on the types of user selections. If you wish to opt-out of any anonymous data collection see the <a class="underline font-bold" href="/privacy#opt-out">Opt-out of Google Analytics tracking</a> section below.
              </p>
            </section>
            
            <section>           
              <p>
                Protecting your private information is our priority. This Statement of Privacy applies to perfectzn.app and Perfect SZN and governs data collection and usage. For the purposes of this Privacy Policy, unless otherwise noted, all references to Perfect SZN include perfectszn.app. The Perfect SZN website is a news and information site. By using the Perfect SZN website, you consent to the data practices described in this statement.
              </p>
            </section>

            <section>
              <h3>Collection of information</h3>
              <p>
                Perfect SZN may collect anonymous demographic information, which is not unique to you, such as your:
              </p>
              <ul>
                <li>Country</li>
                <li>Selections made for a "Perfect SZN"</li>
                <li>General Google Analytics information</li>
              </ul>
            </section>

            <section>
              <h3>Use of information</h3>
              <p>
                Perfect SZN collects and uses your anonymous information to operate its website(s) and deliver the services you have requested.
              </p>
              <p>
                Perfect SZN collects anonymous performance information about the website to measure and provide a better experience. 
              </p>
            </section>

            <section>
              <h3>Sharing information with third parties</h3>
              <p>
                Perfect SZN does not sell, rent or lease its customer lists to third parties.
              </p>
            </section>

            <section>
              <h3>Automatically collected information</h3>
              <p>
                Information about your computer hardware and software may be automatically collected by Perfect SZN. This information can include: your anonymized IP address, browser type, domain names, access times and referring website addresses. This information is used for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of the Perfect SZN website.
              </p>
            </section>

            <section>
              <h3 id="opt-out">Opt-out of Google Analytics tracking</h3>
              <p>
                If you wish to opt-out of Google Analytics tracking you can do so by clicking the button below. When you opt-out Perfect SZN will set an indicator to not run Google Analytics for this browser session. If you clear local storage or use Perfect SZN on another browser or device you will see the banner.
              </p>
              <div class="my-8">
                <button id="opt-out-button" class="outline-button">Opt-out</button>
              </div>
            </section>

            <section>
              <h3>Links</h3>
              <p>
                This website contains links to other sites. Please be aware that we are not responsible for the content or privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information.
              </p>
            </section>

            <section>
              <h3>Children under eighteen</h3>
              <p>
                Perfect SZN does not knowingly collect personally identifiable information from children under the age of eighteen. If you are under the age of eighteen, you must ask your parent or guardian for permission to use this website.
              </p>
            </section>

            <section>
              <h3>External data storage sites</h3>
              <p>
                We may store your selections of a "Perfect SZN" on servers provided by third party hosting vendors with whom we have contracted.
              </p>
              <p>
                Perfect SZN shares user selections with Google Analytics to perform analysis.
              </p>
            </section>

            <section>
              <h3>How long is anonymous data stored?</h3>
              <p>
                Google Analytics information such as visits are retained for a period of 26 months. Events such as selections are retained for 2 months.
              </p>
            </section>

            <section>
              <h3>Changes to this statement</h3>
              <p>
                Perfect SZN reserves the right to change this Privacy Policy from time to time. We will notify you about significant changes in the way we treat collected information by updating any privacy information on this page. Your continued use of the Site and/or Services available through this Site after such modifications will constitute your: (a) acknowledgment of the modified Privacy Policy; and (b) agreement to abide and be bound by that Policy.
              </p>
            </section>

            <section>
              <h3>Contact information</h3>
              <p>
                Perfect SZN welcomes your questions or comments regarding this Statement of Privacy. If you believe that Perfect SZN has not adhered to this Statement, please contact Perfect SZN at:
              </p>
              <div>
                <TwitterLink />
              </div>
            </section>            

          </article>

        </main>

      </body>

    </html>
  )
};
