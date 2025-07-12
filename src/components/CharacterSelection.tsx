import { CHARACTERS_OPTIONS } from "@/settings/game.settings";
import { component$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";

interface CharacterSelectionProps {
  selectedBird: string;
  onSelect: (bird: string) => void;
}

const CharacterSelection = component$<CharacterSelectionProps>(
  ({ selectedBird, onSelect }) => {
    return (
      <>
        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div class="bg-white p-6 rounded-lg text-center max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-4">Choose your character</h2>
            <div class="grid grid-cols-5 gap-3 mb-6">
              {CHARACTERS_OPTIONS.map((bird) => (
                <button
                  key={bird.image}
                  class={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    selectedBird === bird.image
                      ? "border-yellow-400 bg-yellow-100"
                      : "border-gray-300 hover:border-yellow-200"
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
            <button class="px-6 py-2 bg-yellow-400 rounded-full font-bold hover:bg-yellow-500 transition-colors duration-200">
              Confirm
            </button>
          </div>
        </div>
      </>
    );
  },
);

export default CharacterSelection;
