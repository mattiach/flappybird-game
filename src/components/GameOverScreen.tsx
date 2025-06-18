import { component$, type QRL } from '@builder.io/qwik';

interface GameOverScreenProps {
  onRestart: QRL<() => void>;
  score: number;
}

export default component$<GameOverScreenProps>(({ onRestart, score }) => {
  return (
    <>
      <div class="absolute inset-0 flex items-center justify-center bg-black/50">
        <div class="bg-white p-8 rounded-lg text-center">
          <h2 class="text-3xl font-bold mb-4">Game Over</h2>
          <p class="text-lg mb-4">Score: {score}</p>
          <button
            class="px-6 py-2 bg-yellow-400 rounded-full font-bold hover:bg-yellow-500"
            onClick$={onRestart}
          >
            Restart
          </button>
        </div>
      </div>
    </>
  );
});
