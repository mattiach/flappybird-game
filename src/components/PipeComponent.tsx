import { component$ } from "@builder.io/qwik";
import { settings } from "@/settings/game.settings";
import type { Pipe } from "@/interfaces/const";

export default component$((pipe: Pipe) => {
  return (
    <>
      {/* Pipe - TOP */}
      <div
        class="absolute rounded-b-md shadow-md overflow-hidden"
        style={{
          left: `${pipe.x}px`,
          top: "0px",
          width: `${settings.pipeWidth}px`,
          height: `${pipe.topHeight}px`,
        }}
      >
        {/* Pipe body with vertical gradient */}
        <div class="w-full h-full bg-gradient-to-b from-green-500 to-green-700 border-2 border-green-800 relative">
          {/* Light highlight on the left side */}
          <div class="absolute top-0 left-0 w-2 h-full bg-green-300/40"></div>
          {/* Dark band at the bottom for depth */}
          <div class="absolute bottom-0 left-0 right-0 h-6 bg-green-800"></div>
        </div>
      </div>

      {/* Pipe - BOTTOM */}
      <div
        class="absolute rounded-t-md shadow-md overflow-hidden"
        style={{
          left: `${pipe.x}px`,
          top: `${pipe.bottomY}px`,
          width: `${settings.pipeWidth}px`,
          height: `${600 - pipe.bottomY}px`,
        }}
      >
        {/* Pipe body with vertical gradient */}
        <div class="w-full h-full bg-gradient-to-b from-green-500 to-green-700 border-2 border-green-800 relative">
          {/* Light highlight on the left side */}
          <div class="absolute top-0 left-0 w-2 h-full bg-green-300/40"></div>
          {/* Dark band at the top for depth */}
          <div class="absolute top-0 left-0 right-0 h-6 bg-green-800"></div>
        </div>
      </div>
    </>
  );
});
