import { h } from 'preact';

export function ValueBar() {
  return (
    <section class="szn-value-bar">
      
      <section class="szn-value-bar__title">

        <h3 class="szn-value-bar__title__text flex grid grid-cols-3 gap-x-2">
          <span id="szn-value-bar__selected">0</span>
          <span>/</span>
          <span id="szn-value-bar__left">5</span>
        </h3>

      </section>

      <h3 class="szn-value-bar__cost grid grid-cols-2 gap-x-2">
        <span id="szn-value-bar__cost__value">$15</span>
        <span>left</span>
      </h3>
    </section>
  );
}
