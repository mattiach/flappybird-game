import { component$, type QRL } from '@builder.io/qwik';

interface GameStartScreenProps {
  onStart: QRL<() => void>;
}

export default component$<GameStartScreenProps>(({ onStart }) => {
  return (
    <>
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white p-6 rounded-lg text-center">
          <h2 class="text-2xl font-bold mb-4">FlappyBird Clone</h2>
          <p class="mb-4">Press SPACE or click to jump after starting</p>
          <button
            class="px-4 py-2 bg-yellow-400 rounded-full font-bold hover:bg-yellow-500"
            onClick$={onStart}
          >
            START GAME
          </button>
        </div>
      </div>
    </>
  );
});
