import { FunctionalComponent, h } from 'preact';

export const Footer: FunctionalComponent = () => {
  return (
    <footer class="szn-footer">
      <h4 class="szn-footer__heading">
        <a href="/privacy" class="underline font-display uppercase tracking-wide">Privacy policy</a>
      </h4>
      <h4 class="szn-footer__subtitle">
        Made by 
        <a class="underline" href="https://twitter.com/_davideast" rel="noopener" target="blank"> @_davideast</a>
      </h4>
    </footer>
  );
};
