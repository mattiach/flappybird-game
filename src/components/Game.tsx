import {
  $,
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import type { Hitbox, Pipe } from "@/interfaces/const";
import { settings } from "@/settings/game.settings";
import { handleJumpFn, keyListenerFn, startGameFn } from "@/functions/const";

// components
import GameOverScreen from "@/components/GameOverScreen";
import GameStartScreen from "@/components/GameStartScreen";
import GameScore from "@/components/GameScore";
import PipeComponent from "@/components/PipeComponent";
import CharacterSelection from "@/components/CharacterSelection";

export default component$(() => {
  const gameStarted = useSignal(false);
  const gameOver = useSignal(false);
  const score = useSignal(0);
  const birdPosition = useSignal(250);
  const birdVelocity = useSignal(0);
  const pipes = useSignal<Pipe[]>([]);
  const selectedBird = useSignal(
    typeof window !== "undefined" && localStorage.getItem("selectedBird")
      ? localStorage.getItem("selectedBird")!
      : settings.defaultCharacter,
  );

  const showCharacterSelection = useSignal(false);

  // Function to start the game
  const startGame = startGameFn(
    gameStarted,
    gameOver,
    score,
    birdPosition,
    birdVelocity,
    pipes,
    "bg-music", // Html ID for background music
  );

  // Function to handle jump action of the bird
  const handleJump = handleJumpFn(gameStarted, gameOver, birdVelocity);

  // Function to handle key events for starting the game and jumping
  const keyListener = keyListenerFn(
    gameStarted,
    startGame,
    gameOver,
    birdVelocity,
  );

  // Add event listeners for keydown events
  useVisibleTask$(({ cleanup, track }) => {
    window.focus();
    window.addEventListener("keydown", keyListener);
    cleanup(() => window.removeEventListener("keydown", keyListener));

    // Track the selected bird to update localStorage
    track(() => selectedBird.value);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedBird", selectedBird.value);
    }
  });

  // Game loop and logic
  useTask$(({ track, cleanup }) => {
    track(() => gameStarted.value);
    track(() => gameOver.value);

    if (!gameStarted.value || gameOver.value) return;

    let lastTime = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTime) / 16.67; // 60 FPS
      lastTime = now;

      birdVelocity.value += settings.gravity * delta;
      birdPosition.value += birdVelocity.value * delta;

      pipes.value = pipes.value
        .map((pipe) => ({
          ...pipe,
          x: pipe.x - settings.pipeSpeed * delta,
        }))
        .filter((pipe) => pipe.x + settings.pipeWidth > 0);

      if (
        pipes.value.length === 0 ||
        pipes.value[pipes.value.length - 1].x < 400
      ) {
        const gapPosition = Math.floor(Math.random() * 300) + 100;
        pipes.value.push({
          x: 800,
          topHeight: gapPosition,
          bottomY: gapPosition + settings.pipeGap,
          passed: false,
        });
      }

      const Hitbox: Hitbox = {
        top: birdPosition.value,
        bottom: birdPosition.value + 40,
        left: 100,
        right: 140,
      };

      if (Hitbox.top <= 0 || Hitbox.bottom >= 600) {
        gameOver.value = true;
        clearInterval(interval);
        return;
      }

      for (const pipe of pipes.value) {
        const withinX =
          Hitbox.right > pipe.x && Hitbox.left < pipe.x + settings.pipeWidth;
        const hitTop = Hitbox.top < pipe.topHeight;
        const hitBottom = Hitbox.bottom > pipe.bottomY;

        if (withinX && (hitTop || hitBottom)) {
          gameOver.value = true;
          clearInterval(interval);
          return;
        }

        if (!pipe.passed && pipe.x + settings.pipeWidth < Hitbox.left) {
          pipe.passed = true;
          score.value += 1;

          const pointSound = document.getElementById(
            "point-sound",
          ) as HTMLAudioElement;
          if (pointSound) {
            pointSound.currentTime = 0;
            pointSound.play().catch((err) => console.warn("Sound error:", err));
          }
        }
      }
    }, 20);

    cleanup(() => clearInterval(interval));
  });

  return (
    <>
      <div
        class="relative w-full max-w-[800px] h-[600px] bg-blue-300 border-4 border-white rounded-lg overflow-hidden cursor-pointer"
        onClick$={handleJump}
      >
        {/* Game Logo */}
        <Image
          src="/images/logo.png"
          alt="Flappy Bird Logo"
          width={200}
          height={200}
          class="absolute top-2 left-1/2 transform -translate-x-1/2 z-40"
        />

        {/* Clouds */}
        <Image
          src="/images/cloud.png"
          alt="Cloud"
          width={130}
          height={130}
          class="absolute right-8 top-24 opacity-50"
        />
        <Image
          src="/images/cloud.png"
          alt="Cloud"
          width={90}
          height={90}
          class="absolute left-6 top-7 opacity-50"
        />

        {/* Pipes */}
        {pipes.value.map((pipe, idx) => (
          <PipeComponent key={idx} {...pipe} />
        ))}

        {/* Bird */}
        <Image
          src={selectedBird.value}
          alt="Bird"
          width={40}
          height={40}
          style={{
            position: "absolute",
            left: "100px",
            top: `${birdPosition.value}px`,
            transition: "top 0.02s linear",
            zIndex: 10,
          }}
          class={`${gameStarted ? "levitate" : "animate-none"}`}
          onClick$={() => handleJump()}
        />

        {/* Score */}
        <GameScore score={score} />

        {/* Game Start Screen */}
        {!gameStarted.value && !gameOver.value && (
          <GameStartScreen
            onStart={startGame}
            onSelectCharacter={$(() => {
              showCharacterSelection.value = true;
              if (typeof window !== "undefined") {
                localStorage.setItem("selectedBird", selectedBird.value);
              }
            })}
          />
        )}

        {/* Game Over Screen */}
        {gameOver.value && (
          <GameOverScreen
            score={score.value}
            onRestart={$(() => startGame())}
            onSelectCharacter={$(() => {
              showCharacterSelection.value = true;
              if (typeof window !== "undefined") {
                localStorage.setItem("selectedBird", selectedBird.value);
              }
            })}
          />
        )}

        {/* Character Selection */}
        {showCharacterSelection.value && (
          <CharacterSelection
            selectedBird={selectedBird.value}
            onSelect={(bird: string) => {
              selectedBird.value = bird;
              showCharacterSelection.value = false;
            }}
          />
        )}

        {/* Background music and sound effects */}
        <audio id="bg-music" src="/music/background-music.mp3" loop hidden />
        <audio
          id="point-sound"
          src="/music/coin-effect.mp3"
          hidden
          volume={0.05}
        />
      </div>
    </>
  );
});
