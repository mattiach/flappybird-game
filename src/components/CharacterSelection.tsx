import { component$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";

interface CharacterSelectionProps {
  selectedBird: string;
  onSelect: (bird: string) => void;
}

const BIRD_OPTIONS = [
  { name: "Blue Bird", image: "/images/blue-bird.png" },
  { name: "Bird 2", image: "/images/bird2.png" },
  { name: "Bird 3", image: "/images/bird3.png" },
  { name: "Bird 4", image: "/images/bird4.png" },
  { name: "Bird 5", image: "/images/bird5.png" },
  { name: "Bird 6", image: "/images/bird6.png" },
  { name: "Bird 7", image: "/images/bird7.png" },
  { name: "Bird 8", image: "/images/bird8.png" },
  { name: "Bird 9", image: "/images/bird9.png" },
  { name: "Bird 10", image: "/images/bird10.png" },
];

const CharacterSelection = component$<CharacterSelectionProps>(
  ({ selectedBird, onSelect }) => {
    return (
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg text-center max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">Scegli il tuo personaggio</h2>

          <div class="grid grid-cols-5 gap-3 mb-6">
            {BIRD_OPTIONS.map((bird) => (
              <button
                key={bird.image}
                class={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${selectedBird === bird.image
                  ? "border-yellow-400 bg-yellow-100"
                  : "border-gray-300 hover:border-yellow-300"
                  }`}
                onClick$={() => onSelect(bird.image)}
              >
                <Image
                  src={bird.image}
                  alt={bird.name}
                  width={40}
                  height={40}
                  class="w-full h-auto"
                />
              </button>
            ))}
          </div>

          <button
            class="px-6 py-2 bg-yellow-400 rounded-full font-bold hover:bg-yellow-500 transition-colors duration-200"
          >
            Conferma
          </button>
        </div>
      </div>
    );
  },
);

export default CharacterSelection;
