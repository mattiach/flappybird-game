import { component$, type QRL, h } from "@builder.io/qwik";

interface GameStartScreenProps {
  onStart: () => Promise<void>;
  onSelectCharacter: QRL<() => void>;
}

export default component$<GameStartScreenProps>(
  ({ onStart, onSelectCharacter }) =>
    h(
      "div",
      {
        class:
          "absolute inset-0 flex items-center justify-center bg-black bg-opacity-30",
      },
      h(
        "div",
        { class: "bg-white p-6 rounded-lg text-center" },
        h("h2", { class: "text-2xl font-bold mb-4" }, "FlappyBird Clone"),
        h(
          "p",
          { class: "mb-4" },
          "Press SPACE or click to jump after starting"
        ),
        h(
          "div",
          { class: "flex flex-col gap-3" },
          h(
            "button",
            {
              class:
                "px-4 py-2 bg-blue-400 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200",
              onClick$: onSelectCharacter,
            },
            "Scegli Personaggio"
          ),
          h(
            "button",
            {
              class:
                "px-4 py-2 bg-yellow-400 rounded-full font-bold hover:bg-yellow-500 transition-colors duration-200",
              onClick$: onStart,
            },
            "START GAME"
          )
        )
      )
    )
);
