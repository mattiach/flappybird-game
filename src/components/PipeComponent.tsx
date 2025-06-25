import { component$ } from "@builder.io/qwik";
import { settings } from "@/settings/game.settings";
import type { Pipe } from "@/interfaces/const";

export default component$((pipe: Pipe) => {
  return (
    <>
      <div
        class="absolute bg-green-600 border-2 border-green-700"
        style={{
          left: `${pipe.x}px`,
          top: '0px',
          width: `${settings.pipeWidth}px`,
          height: `${pipe.topHeight}px`,
        }}
      >
        <div class="absolute bottom-0 left-0 right-0 h-4 bg-green-600"></div>
      </div>
      <div
        class="absolute bg-green-600 border-2 border-green-700"
        style={{
          left: `${pipe.x}px`,
          top: `${pipe.bottomY}px`,
          width: `${settings.pipeWidth}px`,
          height: `${600 - pipe.bottomY}px`,
        }}
      >
        <div class="absolute top-0 left-0 right-0 h-4 bg-green-600"></div>
      </div>
    </>
  )
});