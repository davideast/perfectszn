import { h } from 'preact';

export function InstructionsPanel() {
  return (
    <section class="px-4 py-8 text-black bg-white rounded-sm szn-instructions">
      <h3 class="mb-2 text-lg font-bold tracking-wider text-black uppercase font-display szn-instructions__heading">
        How to play
      </h3>
      <p class="leading-loose szn-instructions__text">
        <strong>Pick 5</strong> but stay within $15. Once you submit your picks we'll turn them into an image for you to post.
      </p>
    </section>
  );
}
