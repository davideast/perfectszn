import { FunctionalComponent, h } from 'preact';
import render from 'preact-render-to-string';
import { Home } from './Home';
import { Preload } from './components';
import { PrivacyPolicy } from './PrivacyPolicy';
import { writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { rm, exec } from 'shelljs';
import { copySync } from 'cpx';
import { ARVO_BASE64 } from './fonts/Arvo';
import { KARLA_BASE64 } from './fonts/Karla';

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
writeFileSync(publicPath('assets/Arvo.txt'), ARVO_BASE64);
writeFileSync(publicPath('assets/Karla.txt'), KARLA_BASE64);

// Get preloads
const jsPreloads = readdirSync(publicPath('js'))
  .filter(file => file !== 'index.js')
  .filter(file => file !== 'privacy.js')
  .map(file => ({ path: `/js/${file}`, type: 'script' }));

console.log('Generating preloads for: ')
jsPreloads.forEach(({ path, type }) => {
  console.log(`    <link rel="preload" href="${path}" as=${type} crossorigin />`);
});

const preloads = Preload(jsPreloads);

// Write html documents
componentToString(() => <Home preloads={preloads} />, 'index.html');
componentToString(() => <PrivacyPolicy preloads={preloads} />, 'privacy.html');
