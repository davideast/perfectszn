import { h } from 'preact';

export function Header() {
  return (
    <header class="szn-header">

      <h1 class="szn-header__title">
        Perfect SZN
      </h1>
      <h2 class="szn_header__subtitle">
        Denver Nuggets
      </h2>

      <div class="szn-header__skyline">
        <img src="/assets/skyline.svg" alt="Denver Rainbow Skyline" />
      </div>

    </header>
  );
}
