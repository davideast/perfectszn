import { h } from 'preact';

export function ValueBar() {
  return (
    <section class="szn-value-bar">
      
      <section class="szn-value-bar__title">

        <h3 class="szn-value-bar__title__text">
          <span>1</span>
          <span>/</span>
          <span>5</span>
        </h3>

      </section>

      <h3 class="szn-value-bar__cost">
        <span>$15</span>
        <span>left</span>
      </h3>
    </section>
  )
}
