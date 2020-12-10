import { h, FunctionalComponent } from 'preact';

export const Scroller: FunctionalComponent = ({ children }) => {
  return (
    <main class="szn-scroll">
      {children}
    </main>
  )
};
