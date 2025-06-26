import { component$, type QRL } from "@builder.io/qwik";

interface GameStartScreenProps {
  onStart: () => Promise<void>;
  onSelectCharacter: QRL<() => void>;
}

export default component$<GameStartScreenProps>(({ onStart, onSelectCharacter }) => {
  return (
    <>
      <div class="absolute inset-0 flex items-center justify-center bg-black/50">
        <div class="bg-white p-6 rounded-lg text-center">
          <h2 class="text-2xl font-bold mb-4">FlappyBird</h2>
          <p class="mb-4">Press SPACE or click to jump after starting</p>
          <div class="flex flex-col gap-3">
            <button
              class="px-4 py-2 bg-blue-400 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200"
              onClick$={onSelectCharacter}
            >
              Choose Character
            </button>
            <button
              class="px-4 py-2 bg-yellow-400 rounded-full font-bold hover:bg-yellow-500 transition-colors duration-200"
              onClick$={onStart}
            >
              START GAME
            </button>
          </div>
        </div>
      </div>
    </>
  );
});
