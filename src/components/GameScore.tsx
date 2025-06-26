import { component$, type Signal } from "@builder.io/qwik";

interface GameScoreProps {
  score: Signal<number>;
}

export default component$<GameScoreProps>(({ score }) => {
  return (
    <>
      <div
        class="absolute top-20 left-0 right-0 text-center"
        data-oid="kh6m3h-"
      >
        <span
          class="text-4xl font-bold text-white drop-shadow-lg"
          data-oid="6vypy5o"
        >
          {score.value}
        </span>
      </div>
    </>
  );
});
