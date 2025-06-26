import { component$ } from "@builder.io/qwik";
import Game from "@/components/Game";

export default component$(() => {
  return (
    <>
      <main
        class="min-h-screen w-full flex justify-center items-center bg-gradient-to-b from-[var(--fb-cyan)] from-60% to-[var(--fb-yellow)] to-100%"
        data-oid="fmbd4fi"
      >
        <div class="relative w-[500px] min-h-screen" data-oid="r2s4yl0">
          <Game data-oid="lu.xdgo" />
        </div>
      </main>
    </>
  );
});
