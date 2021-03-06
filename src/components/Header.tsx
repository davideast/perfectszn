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
        <svg width="412" height="136"><g fill="none" fill-rule="evenodd"><rect fill="#E04733" width="412" height="4" rx="2" /><rect fill="#E04733" y="12" width="412" height="4" rx="2" /><rect fill="#FF6B1C" x="100" y="36" width="312" height="4" rx="2" /><rect fill="#FF6B1C" x="100" y="24" width="312" height="4" rx="2" /><rect fill="#FFE600" x="40" y="60" width="372" height="4" rx="2" /><rect fill="#FFE600" x="40" y="48" width="372" height="4" rx="2" /><rect fill="#14B045" x="56" y="84" width="356" height="4" rx="2" /><rect fill="#14B045" x="56" y="72" width="356" height="4" rx="2" /><rect fill="#0034AC" x="113" y="108" width="299" height="4" rx="2" /><rect fill="#0034AC" x="113" y="96" width="299" height="4" rx="2" /><rect fill="#67318E" x="186" y="120" width="226" height="4" rx="2" /><rect fill="#67318E" x="186" y="132" width="226" height="4" rx="2" /></g></svg>
      </div>

    </header>
  );
}
