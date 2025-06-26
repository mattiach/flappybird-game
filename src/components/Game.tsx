import {
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

export default component$(() => {
  const gameStarted = useSignal(false);
  const gameOver = useSignal(false);
  const score = useSignal(0);
  const birdPosition = useSignal(250);
  const birdVelocity = useSignal(0);
  const pipes = useSignal<Pipe[]>([]);

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
    <>
      <div
        class="flex flex-col items-center justify-center overflow-y-hidden h-screen"
        data-oid="_0b-o2p"
      >
        <div
          class="relative w-full max-w-[800px] h-[600px] bg-blue-300 border-4 border-white rounded-lg overflow-hidden cursor-pointer"
          onClick$={handleJump}
          data-oid="87svyov"
        >
          {/* Game Logo */}
          <Image
            src="/images/logo.png"
            alt="Flappy Bird Logo"
            width={180}
            height={180}
            class="absolute top-2 left-1/2 transform -translate-x-1/2 z-50"
            data-oid="gg7y7qz"
          />

          {/* Clouds */}
          <Image
            src="/images/cloud.png"
            alt="Cloud"
            width={130}
            height={130}
            class="absolute right-8 top-24 opacity-50"
            data-oid="-20:i4a"
          />

          <Image
            src="/images/cloud.png"
            alt="Cloud"
            width={90}
            height={90}
            class="absolute left-6 top-7 opacity-50"
            data-oid="7ohu3j7"
          />

          {/* Bird */}
          <div
            class="absolute w-40 h-40 left-[100px]"
            style={{ top: `${birdPosition.value}px` }}
            data-oid="7y.v2n8"
          >
            <Image
              src="/images/blue-bird.png"
              alt="Flappy Bird"
              class={`${gameOver.value ? "z-0" : "z-50"}`}
              width={40}
              height={40}
              data-oid="rqq30.5"
            />
          </div>

          {/* Pipes */}
          {pipes.value.map((pipe, index) => (
            <div key={index} data-oid="civ_d-y">
              <PipeComponent {...pipe} data-oid="hvic619" />
            </div>
          ))}

          {/* Game score shown during the game */}
          <GameScore score={score} data-oid="-2ge_.1" />

          {/* Start screen */}
          {!gameStarted.value && (
            <GameStartScreen onStart={startGame} data-oid="fphxylu" />
          )}

          {/* Game over screen */}
          {gameOver.value && (
            <>
              <Image
                src="/images/settings.svg"
                alt="Settings"
                width={40}
                height={40}
                class="absolute bottom-3 right-4 z-50 hover:scale-110 transition-transform duration-200 cursor-pointer"
                data-oid="eeo2jak"
              />

              <GameOverScreen
                onRestart={startGame}
                score={score.value}
                data-oid="8yjkizh"
              />
            </>
          )}

          {/* Background music and sound effects */}
          <audio
            id="bg-music"
            src="/music/background-music.mp3"
            loop
            hidden
            data-oid="0mc6h77"
          />

          <audio
            id="point-sound"
            src="/music/coin-effect.mp3"
            hidden
            volume={0.2}
            data-oid="mbw1q0u"
          />
        </div>
      </div>
    </>
  );
});
