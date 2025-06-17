import {
  $,
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { Image } from '@unpic/qwik';
import type { Hitbox, Pipe } from '@/interfaces/const';
import { settings } from '@/settings/game.settings';

// components
import GameOverScreen from '@/components/GameOverScreen';
import GameStartScreen from '@/components/GameStartScreen';

export default component$(() => {
  const gameStarted = useSignal(false);
  const gameOver = useSignal(false);
  const score = useSignal(0);
  const birdPosition = useSignal(250);
  const birdVelocity = useSignal(0);
  const pipes = useSignal<Pipe[]>([]);

  const handleJump = $(() => {
    if (!gameStarted.value || gameOver.value) {
      gameStarted.value = true;
      gameOver.value = false;
      score.value = 0;
      birdPosition.value = 150;
      birdVelocity.value = 0;
      pipes.value = [];
    } else {
      birdVelocity.value = settings.jumpStrength;
    }
  });

  useVisibleTask$(({ cleanup }) => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleJump();
      }
    };
    window.addEventListener('keydown', keyListener);
    cleanup(() => window.removeEventListener('keydown', keyListener));
  });

  useTask$(({ track }) => {
    track(() => gameStarted.value);
    track(() => gameOver.value);
    track(() => birdPosition.value);
    track(() => birdVelocity.value);
    track(() => pipes.value);

    if (!gameStarted.value || gameOver.value) return;

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
        bottom: birdPosition.value + 40, // bird height
        left: 100,
        right: 100 + 40, // bird width
      };

      // Check collision with top and bottom
      if (Hitbox.top <= 0 || Hitbox.bottom >= 600) {
        gameOver.value = true;
        clearInterval(interval);
        return;
      }

      for (const pipe of pipes.value) {
        // Collisione con pipe
        const withinX =
          Hitbox.right > pipe.x && Hitbox.left < pipe.x + settings.pipeWidth;
        const hitTop = Hitbox.top < pipe.topHeight;
        const hitBottom = Hitbox.bottom > pipe.bottomY;

        if (withinX && (hitTop || hitBottom)) {
          gameOver.value = true;
          clearInterval(interval);
          return;
        }

        // Score increment
        if (!pipe.passed && pipe.x + settings.pipeWidth < Hitbox.left) {
          pipe.passed = true;
          score.value += 1;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  });

  return (
    <>
      <div class="flex flex-col items-center justify-center bg-[var(--fb-cyan)] overflow-y-hidden h-screen">
        <div
          class="relative w-full max-w-[800px] h-[600px] bg-blue-300 border-4 border-white rounded-lg overflow-hidden cursor-pointer"
          onClick$={handleJump}
        >
          {/* Clouds */}
          <div>
            <Image
              src="/images/cloud.png"
              alt="Cloud"
              width={130}
              height={130}
              class="absolute right-10 top-24 opacity-50"
            />
            <Image
              src="/images/cloud.png"
              alt="Cloud"
              width={100}
              height={100}
              class="absolute left-6 top-7 opacity-50"
            />
          </div>

          {/* Ground */}
          <div class="absolute bottom-0 w-full h-14 bg-green-800"></div>

          {/* Bird */}
          <div class={`absolute w-40 h-40 left-[100px]`} style={{ top: `${birdPosition.value}px` }}>
            <Image
              src="/images/blue-bird.png"
              alt="Flappy Bird"
              width={40}
              height={40}
            />
          </div>

          {/* Pipes */}
          {pipes.value.map((pipe, index) => (
            <div key={index}>
              <div
                class="absolute bg-green-600 border-2 border-green-700"
                style={{
                  left: `${pipe.x}px`,
                  top: '0px',
                  width: `${settings.pipeWidth}px`,
                  height: `${pipe.topHeight}px`,
                }}
              >
                <div class="absolute bottom-0 left-0 right-0 h-4 bg-green-600"></div>
              </div>
              <div
                class="absolute bg-green-600 border-2 border-green-700"
                style={{
                  left: `${pipe.x}px`,
                  top: `${pipe.bottomY}px`,
                  width: `${settings.pipeWidth}px`,
                  height: `${600 - pipe.bottomY}px`,
                }}
              >
                <div class="absolute top-0 left-0 right-0 h-4 bg-green-600"></div>
              </div>
            </div>
          ))}

          {/* Score */}
          <div class="absolute top-4 left-0 right-0 text-center">
            <span class="text-4xl font-bold text-white drop-shadow-lg">
              {score.value}
            </span>
          </div>

          {/* Start screen */}
          {!gameStarted.value && <GameStartScreen handleJump={handleJump} />}

          {/* Game Over screen */}
          {gameOver.value && <GameOverScreen handleJump={handleJump} score={score.value} />}
        </div>
      </div>
    </>
  );
});
