import { component$, type QRL } from "@builder.io/qwik";

interface GameOverScreenProps {
  onRestart: QRL<() => void>;
  score: number;
}

export default component$<GameOverScreenProps>(({ onRestart, score }) => {
  return (
    <>
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/50"
        data-oid="6h6m6v2"
      >
        <div class="bg-white p-8 rounded-lg text-center" data-oid="_gqspm_">
          <h2 class="text-3xl font-bold mb-4" data-oid="5waevil">
            Game Over
          </h2>
          <p class="text-lg mb-4" data-oid="rgmf21_">
            Score: {score}
          </p>
          <button
            class="px-6 py-2 bg-yellow-400 rounded-full font-bold hover:bg-yellow-500"
            onClick$={onRestart}
            data-oid="9yohdhj"
          >
            Restart
          </button>
        </div>
      </div>
    </>
  );
});
