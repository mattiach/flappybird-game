import { component$, type QRL } from "@builder.io/qwik";

interface GameOverScreenProps {
  onRestart: QRL<() => void>;
  onSelectCharacter: QRL<() => void>;
  score: number;
}

export default component$<GameOverScreenProps>(({
  onRestart,
  onSelectCharacter,
  score,
}) => {
  return (
    <>
      <div class="absolute inset-0 flex items-center justify-center bg-black/50">
        <div class="bg-white p-8 rounded-lg text-center">
          <h2 class="text-3xl font-bold mb-4">Game Over</h2>
          <p class="text-lg mb-6">Score: {score}</p>
          <div class="flex flex-col gap-3">
            <button
              class="px-6 py-2 bg-blue-400 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200"
              onClick$={onSelectCharacter}
            >
              Select Character
            </button>
            <button
              class="px-6 py-2 bg-yellow-400 rounded-full font-bold hover:bg-yellow-500 transition-colors duration-200"
              onClick$={onRestart}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </>
  );
},
);
