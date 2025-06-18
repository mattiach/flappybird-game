import { component$ } from '@builder.io/qwik';
import Game from '@/components/Game';

export default component$(() => {
  return (
    <>
      <main class="min-h-screen w-full bg-[var(--fb-cyan)] flex justify-center items-center">
        <div class="relative w-[500px] min-h-screen">
          <Game />
        </div>
      </main>
    </>
  );
});
