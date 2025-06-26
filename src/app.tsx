import { component$ } from "@builder.io/qwik";
import Game from "@/components/Game";

export default component$(() => {
  return (
    <>
      <main
        class="min-h-screen w-full flex justify-center items-center bg-gradient-to-b from-[var(--fb-cyan)] from-60% to-[var(--fb-yellow)] to-100%"
        data-oid="py2us2f"
      >
        <div class="relative w-[500px] min-h-screen" data-oid="rkr-am0">
          <Game data-oid=":8cyn9i" />
        </div>
      </main>
    </>
  );
});
