import { h } from "preact";
import { TopicButton } from "./TopicButton";

function Skyline() {
  <div id="szn-skyline" class="szn-skyline">
    <img
      class="szn-skyline__wave"
      src="/assets/skyline-wave.svg"
      alt="Skyline wave"
    />
    <div
      id="post-card"
      style={{ border: "3px solid white", width: "92%" }}
      class="w-full rounded-sm overflow-x-hidden hidden gap-y-8 overflow-y-hidden"
    >
      <div class="flex items-end justify-between">
        <div class="ml-20">
          <h4 class="font-display text-5xl">Perfect SZN</h4>
          <h5 class="text-2xl mt-2">Denver Nuggets</h5>
        </div>
        <img
          class="relative"
          src="/assets/skyline.svg"
          alt="Denver Rainbow Skyline"
          style={{ left: "4px", top: "32px" }}
        />
      </div>
      <div id="selections" class="m-20 grid grid-cols-4 gap-y-6 gap-x-4">
        <TopicButton>Jokic MVP</TopicButton>
        <TopicButton>Jokic MVP</TopicButton>
        <TopicButton>Jokic MVP</TopicButton>
        <TopicButton>Jokic MVP</TopicButton>
        <TopicButton>Jokic MVP</TopicButton>
        <div
          style={{ border: "3px solid white", gridArea: "2 / 2 / 3 / 5" }}
          class="grid grid-cols-2 py-4 px-8 items-center justify-between rounded-sm"
        >
          <h5 class="text-lg font-display uppercase">Create yours</h5>
          <div class="text-xl underline text-right">perfectszn.app</div>
        </div>
      </div>
    </div>
  </div>;
}
