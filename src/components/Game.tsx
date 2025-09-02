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
import {
  detectBrowserSettings,
  handleJumpFn,
  keyListenerFn,
  startGameFn,
} from "@/functions/const";

// components
import GameOverScreen from "@/components/GameOverScreen";
import GameStartScreen from "@/components/GameStartScreen";
import GameScore from "@/components/GameScore";
import PipeComponent from "@/components/PipeComponent";
import CharacterSelection from "@/components/CharacterSelection";

// 👇 Coin interface
interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

export default component$(() => {
  const gameStarted = useSignal(false);
  const gameOver = useSignal(false);
  const bestScore = useSignal(
    typeof window !== "undefined" && localStorage.getItem("bestScore")
      ? Number(localStorage.getItem("bestScore"))
      : 0,
  );
  const score = useSignal(0);
  const birdPosition = useSignal(settings.bird_position || 250);
  const birdSpeed = useSignal(settings.bird_velocity || 22.75);
  const pipes = useSignal<Pipe[]>([]);
  const coins = useSignal<Coin[]>([]);
  const selectedBird = useSignal(
    typeof window !== "undefined" && localStorage.getItem("selectedBird")
      ? localStorage.getItem("selectedBird")!
      : settings.defaultCharacter,
  );
  const browser = useSignal("Unknown Browser");
  const gameSettings = useSignal({ ...settings });
  const showCharacterSelection = useSignal(false);

  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      detectBrowserSettings(
        navigator.userAgent,
        settings,
        (name) => (browser.value = name),
        (newSettings) => {
          gameSettings.value = { ...gameSettings.value, ...newSettings };
        },
      );
    }
  });

  const startGame = startGameFn(
    gameStarted,
    gameOver,
    score,
    birdPosition,
    birdSpeed,
    pipes,
    "bg-music",
  );

  const handleJump = handleJumpFn(gameStarted, gameOver, birdSpeed);
  const keyListener = keyListenerFn(
    gameStarted,
    startGame,
    gameOver,
    birdSpeed,
  );

  useVisibleTask$(({ cleanup, track }) => {
    window.focus();
    window.addEventListener("keydown", keyListener);
    cleanup(() => window.removeEventListener("keydown", keyListener));

    track(() => selectedBird.value);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedBird", selectedBird.value);
    }
  });

  // Game loop
  useTask$(({ track, cleanup }) => {
    track(() => gameStarted.value);
    track(() => gameOver.value);

    if (!gameStarted.value || gameOver.value) return;

    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 16.67;
      lastTime = time;

      birdSpeed.value += gameSettings.value.gravity * delta;
      birdPosition.value += birdSpeed.value * delta;

      // Update pipes
      pipes.value = pipes.value
        .map(pipe => ({ ...pipe, x: pipe.x - gameSettings.value.pipeSpeed * delta }))
        .filter(pipe => pipe.x + settings.pipeWidth > 0);

      // Update coins
      coins.value = coins.value
        .map(coin => ({ ...coin, x: coin.x - gameSettings.value.pipeSpeed * delta }))
        .filter(coin => !coin.collected && coin.x > -40);

      // Generate new pipes (and coins)
      if (pipes.value.length === 0 || pipes.value[pipes.value.length - 1].x < 400) {
        const gapPosition = Math.floor(Math.random() * 300) + 100;
        pipes.value.push({
          x: 800,
          topHeight: gapPosition,
          bottomY: gapPosition + settings.pipeGap,
          passed: false,
        });

        // 10% chance to spawn a coin
        if (Math.random() < 0.1) {
          coins.value.push({
            x: 800 + settings.pipeWidth / 2 - 15,
            y: gapPosition + 20 + Math.random() * (settings.pipeGap - 40),
            collected: false,
          });
        }
      }

      // Bird hitbox
      const Hitbox: Hitbox = {
        top: birdPosition.value,
        bottom: birdPosition.value + 40,
        left: 100,
        right: 140,
      };

      if (Hitbox.top <= 0 || Hitbox.bottom >= 600) {
        gameOver.value = true;
        return;
      }

      // Pipe collision + scoring
      for (const pipe of pipes.value) {
        const withinX = Hitbox.right > pipe.x && Hitbox.left < pipe.x + settings.pipeWidth;
        const hitTop = Hitbox.top < pipe.topHeight;
        const hitBottom = Hitbox.bottom > pipe.bottomY;

        if (withinX && (hitTop || hitBottom)) {
          gameOver.value = true;
          return;
        }

        if (!pipe.passed && pipe.x + settings.pipeWidth < Hitbox.left) {
          pipe.passed = true;
          score.value += 1;
        }
      }

      // Coin collision
      for (const coin of coins.value) {
        if (coin.collected) continue;
        const withinX = Hitbox.right > coin.x && Hitbox.left < coin.x + 30;
        const withinY = Hitbox.bottom > coin.y && Hitbox.top < coin.y + 30;

        if (withinX && withinY) {
          coin.collected = true;
          score.value += 5;

          const pointSound = document.getElementById("point-sound") as HTMLAudioElement;
          if (pointSound) {
            pointSound.currentTime = 0;
            pointSound.play().catch(err => console.warn("Sound error:", err));
          }
        }
      }

      if (!gameOver.value) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    cleanup(() => { });
  });

  return (
    <>
      <div
        class="relative w-full max-w-[800px] h-[600px] bg-blue-300 border-4 border-white rounded-lg overflow-hidden cursor-pointer"
        onClick$={handleJump}
      >
        {/* Pipes */}
        {pipes.value.map((pipe, idx) => (
          <PipeComponent key={idx} {...pipe} />
        ))}

        {/* Coins */}
        {coins.value.map(
          (coin, idx) =>
            !coin.collected && (
              <Image
                key={idx}
                src="/images/coin.png"
                alt="Coin"
                width={30}
                height={30}
                style={{
                  position: "absolute",
                  left: `${coin.x}px`,
                  top: `${coin.y}px`,
                  zIndex: 5,
                }}
              />
            ),
        )}

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
            zIndex: 10,
          }}
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

        {/* Game Over Screen */}
        {gameOver.value && !showCharacterSelection.value && (
          <GameOverScreen
            bestScore={bestScore}
            score={score.value}
            onRestart={$(() => startGame())}
            onSelectCharacter={$(() => {
              gameOver.value = false;
              showCharacterSelection.value = true;
              if (typeof window !== "undefined") {
                localStorage.setItem("selectedBird", selectedBird.value);
              }
            })}
          />
        )}

        {/* Background audio */}
        <audio id="bg-music" src="/music/background-music.mp3" loop hidden />
        <audio id="point-sound" src="/music/coin-effect.mp3" hidden volume={0.05} />
      </div>
    </>
  );
});
