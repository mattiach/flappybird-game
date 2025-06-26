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
  const selectedBird = useSignal("/images/blue-bird.png");
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
  useVisibleTask$(({ cleanup }) => {
    window.focus();
    window.addEventListener("keydown", keyListener);
    cleanup(() => window.removeEventListener("keydown", keyListener));
  });

  // Game loop and logic
  useTask$(({ track }) => {
    track(() => gameStarted.value);
    track(() => gameOver.value);
    track(() => birdPosition.value);
    track(() => birdVelocity.value);
    track(() => pipes.value);

    if (!gameStarted.value || gameOver.value) return;

    // This const is used to control the game loop, music, and game logic
    const interval = setInterval(() => {
      birdVelocity.value += settings.gravity;
      birdPosition.value += birdVelocity.value;
      pipes.value = pipes.value
        .map((pipe) => ({ ...pipe, x: pipe.x - settings.pipeSpeed }))
        .filter((pipe) => pipe.x + settings.pipeWidth > 0);

      if (
        pipes.value.length === 0 ||
        pipes.value[pipes.value.length - 1].x < 400
      ) {
        const gapPosition = Math.floor(Math.random() * 300) + 100;
        pipes.value = [
          ...pipes.value,
          {
            x: 800,
            topHeight: gapPosition,
            bottomY: gapPosition + settings.pipeGap,
            passed: false,
          },
        ];
      }

      const Hitbox: Hitbox = {
        top: birdPosition.value,
        bottom: birdPosition.value + 40,
        left: 100,
        right: 100 + 40,
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
          ) as HTMLAudioElement | null;
          if (pointSound) {
            pointSound.currentTime = 0;
            pointSound.play().catch((err) => {
              console.warn("Point sound play failed:", err);
            });
          }
        }
      }
    }, 20);
    return () => clearInterval(interval);
  });

  return (
    <div class="relative w-[800px] h-[600px] bg-sky-400 overflow-hidden mx-auto select-none border-4 border-white rounded-lg shadow-lg">
      {/* Background music */}
      <audio id="bg-music" src="/sounds/bg-music.mp3" loop />
      {/* Point sound */}
      <audio id="point-sound" src="/sounds/point.mp3" />

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
    </div>
  );
});
