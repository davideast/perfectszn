import { FunctionalComponent, h } from 'preact';
import render from 'preact-render-to-string';
import { Home } from './Home';
import { Preload } from './components';
import { PrivacyPolicy } from './PrivacyPolicy';
import { writeFileSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { rm, exec } from 'shelljs';
import { copySync } from 'cpx';
import { ARVO_BASE64 } from './fonts/Arvo';
import { KARLA_BASE64 } from './fonts/Karla';
import * as crypto from 'crypto';

const HOSTING_CONFIG_PATH = join(__dirname, '../firebase.json');
const firebase = require(HOSTING_CONFIG_PATH);

const CACHE_VERSION = '1';
const CACHE_FOREVER = 'public, max-age=31536000, s-maxage=max-age=31536000';

function createHash(content: string) {
  // change to 'md5' if you want an MD5 hash
  const hash = crypto.createHash("md5");
  hash.setEncoding('hex');
  hash.write(content);
  hash.end();
  return hash.read();
}

/**
 * 0. Delete public
 * 1. Run tailwind
 * 2. Make public
 * 3. Copy static assets
 * 4. Create font string files for SVG generation
 * 5. Read main.css and embed in html
 * 6. Write html documents
 */
const PUBLIC_PATH = join(process.cwd(), `public`);
const publicPath = (extra: string) => join(PUBLIC_PATH, extra);

function componentToString(Component: FunctionalComponent, outFile: string) {
  const componentString = render(<Component />);
  const destPath = publicPath(outFile);
  writeFileSync(destPath, `<!DOCTYPE html>${componentString}`);
  console.log(`Wrote ${destPath}`);
}

// Delete public
rm('-rf', PUBLIC_PATH)

// Run Tailwind
exec(`NODE_ENV='${process.env.NODE_ENV}' node_modules/.bin/postcss ./tailwind/tailwind.css -o ${publicPath('main.css')}`);

// Run Rollup
exec(`NODE_ENV='${process.env.NODE_ENV}' node_modules/.bin/rollup -c rollup.config.js`);

// Copy static assets
copySync('src/assets/**/*.*', publicPath('assets'));
copySync('src/fonts/**/*.*', publicPath('assets'));

// Copy font values thare are embedded when SVGs are generated
const arvoHash = createHash(ARVO_BASE64);
const karlaHash = createHash(KARLA_BASE64);
const arvoFileName = `Arvo-${arvoHash}.txt`;
const karlaFileName = `Karla-${karlaHash}.txt`;
const arvoFilePath = publicPath(`assets/${arvoFileName}`);
const karlaFilePath = publicPath(`assets/${karlaFileName}`);

writeFileSync(arvoFilePath, ARVO_BASE64);
console.log(`Wrote ${arvoFilePath}`);
writeFileSync(karlaFilePath, KARLA_BASE64);
console.log(`Wrote ${karlaFilePath}`);

// Get preloads
const jsPreloads = readdirSync(publicPath('js'))
  .filter(file => file !== 'index.js')
  .filter(file => file !== 'privacy.js')
  .map(file => ({ path: `/js/${file}`, type: 'script' }));

console.log('Generating preloads for: ')
jsPreloads.forEach(({ path, type }) => {
  console.log(`    <link rel="preload" href="${path}" as="${type}" crossorigin />`);
});

const preloads = Preload(jsPreloads);

// Create cache script for generated fonts
const cacheTemplate = readFileSync(`${__dirname}/js/cache.template.ts`, 'utf-8');
const versionedCacheTemplate = cacheTemplate.replace('::version::', CACHE_VERSION);

const finalCacheScript = versionedCacheTemplate.replace('/*::requests::*/', [
  `'/assets/${arvoFileName}'`,
  `'/assets/${karlaFileName}'`,
].join(', '));

const finalCacheScriptPath = publicPath('js/cache.js');
writeFileSync(finalCacheScriptPath, finalCacheScript, 'utf-8');
console.log(`Wrote: ${finalCacheScriptPath}`);

const indexContent = readFileSync(publicPath('/js/index.js'), 'utf-8');
const versionReplaced = indexContent.replace('::VERSION::', CACHE_VERSION);
const arvoReplaced = versionReplaced.replace('::ARVO_PATH::', `/assets/${arvoFileName}`);
const finalWithFonts = arvoReplaced.replace('::KARLA_PATH::', `/assets/${karlaFileName}`);
const indexHash = createHash(finalWithFonts);
const relativeIndexPath = `js/index-${indexHash}.js`;
writeFileSync(publicPath(relativeIndexPath), finalWithFonts, 'utf-8');
console.log(`Wrote: ${publicPath(relativeIndexPath)}`);


// Write html documents
componentToString(() => <Home preloads={preloads} indexScript={`/${relativeIndexPath}`} />, 'index.html');
componentToString(() => <PrivacyPolicy preloads={preloads} />, 'privacy.html');

firebase.hosting.headers = [
  {
    "source": `/${relativeIndexPath}`,
    "headers": [{
      "key": "Cache-Control",
      "value": CACHE_FOREVER,
    }],
  },
  {
    "source": `/${`assets/${karlaFileName}`}`,
    "headers": [{
      "key": "Cache-Control",
      "value": CACHE_FOREVER,
    }],
  },
  {
    "source": `/${`assets/${arvoFileName}`}`,
    "headers": [{
      "key": "Cache-Control",
      "value": CACHE_FOREVER,
    }],
  },
]

writeFileSync(HOSTING_CONFIG_PATH, JSON.stringify(firebase, null, 2), 'utf-8');