import { FunctionalComponent, h, JSX } from 'preact';
import render from 'preact-render-to-string';
import { Home } from './Home';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { rm, exec } from 'shelljs';
import { copySync } from 'cpx';

/**
 * 0. Delete public
 * 1. Run tailwind
 * 2. Make public
 * 3. Copy static assets
 * 4. Write html documents
 */

const PUBLIC_PATH = join(process.cwd(), `public`);
const publicPath = (extra: string) => join(PUBLIC_PATH, extra);

// Delete public
rm('-rf', PUBLIC_PATH)

// Run Tailwind
exec(`NODE_ENV='production' node_modules/.bin/postcss ./tailwind/tailwind.css -o ${publicPath('main.css')}`);

// Copy static assets
copySync('src/assets/**/*.*', publicPath('assets'));

// Write html documents
componentToString(Home, 'index.html');

function componentToString(Component: FunctionalComponent, outFile: string) {
  const componentString = render(<Component />);
  const destPath = publicPath(outFile);
  writeFileSync(destPath, `<!DOCTYPE html>${componentString}`);
  console.log(`Wrote ${destPath}`);
}
