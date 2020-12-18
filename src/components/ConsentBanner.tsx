import { FunctionalComponent, h } from 'preact';

export const ConsentBanner: FunctionalComponent = () => {
  return (
    <section class="szn-consent-banner">
      <div class="flex justify-between">
        <div class="p-4">
          <p class="">
            We serve cookies on this site to analyze traffic and optimize your experience.
          </p>
          <div>
            <a href="/about" class="text-blue uppercase tracking-wide underline">Learn More</a>
          </div>
        </div>
        <button class="szn-consent-banner__button py-2 px-8 bg-orange text-white font-bold">
          X
        </button>
      </div>
    </section>
  );
};
