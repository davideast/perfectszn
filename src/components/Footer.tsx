import { FunctionalComponent, h } from 'preact';

export const Footer: FunctionalComponent = () => {
  return (
    <footer class="szn-footer">
      <h4 class="szn-footer__heading">
        Not official
      </h4>
      <h4 class="szn-footer__subtitle">
        Made for fun by 
        <a class="underline" href="https://twitter.com/_davideast" rel="noopener" target="blank">@_davideast</a>
      </h4>
    </footer>
  );
};
