import { component$ } from '@builder.io/qwik';
import Game from '@/components/Game';
import { Image } from '@unpic/qwik';

export default component$(() => {
  return (
    <>
      <main class="min-h-screen w-full bg-[var(--fb-cyan)] relative">
        <div class="absolute left-1/2 top-4 transform -translate-x-1/2 z-50">
          <Image
            src="/images/logo.png"
            alt="Flappy Bird Logo"
            width={180}
            height={180}
          />
        </div>
        <Game />
      </main>
    </>
  );
});
