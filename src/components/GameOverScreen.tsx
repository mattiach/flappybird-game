import { component$, useTask$ } from "@builder.io/qwik";
import type { QRL, Signal } from "@builder.io/qwik";

interface GameOverScreenProps {
  onRestart: QRL<() => void>;
  onSelectCharacter: QRL<() => void>;
  score: number;
  bestScore: Signal<number>;
}

export default component$<GameOverScreenProps>(
  ({ onRestart, onSelectCharacter, score, bestScore }) => {

    // Updates the user's best score
    useTask$(() => {
      if (score > bestScore.value) {
        bestScore.value = score;
        if (typeof window !== "undefined") {
          localStorage.setItem("bestScore", String(score));
        }
      }
    });

    return (
      <>
        <div class="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div class="bg-white p-4 rounded-lg text-center w-64">
            <h2 class="text-3xl font-bold mb-4">Game Over</h2>
            <div class="flex justify-around gap-2">
              <p class="text-lg">Score: <span class="font-bold">{score}</span></p>
              <p class="text-lg mb-6">Best Score: <span class="font-bold">{bestScore.value}</span></p>
            </div>
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
