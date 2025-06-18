import type { Pipe } from "@/interfaces/const";
import { settings } from "@/settings/game.settings";
import { $, type Signal } from "@builder.io/qwik";

/**
 * Function to handle key events for starting the game and jumping.
 * @param gameStarted - Signal indicating if the game has started.
 * @param startGame - Function to start the game.
 * @param gameOver - Signal indicating if the game is over.
 * @param birdVelocity - Signal representing the bird's vertical velocity.
 */
export function keyListenerFn(
  gameStarted: Signal<boolean>,
  startGame: () => void,
  gameOver: Signal<boolean>,
  birdVelocity: Signal<number>,
) {
  return (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      if (!gameStarted.value) {
        startGame();
      } else if (!gameOver.value) {
        birdVelocity.value = settings.jumpStrength;
      }
    }
  };
}

/**
 * Function to handle the jump action of the bird.
 * @param gameStarted - Signal indicating if the game has started.
 * @param gameOver - Signal indicating if the game is over.
 * @param birdVelocity - Signal representing the bird's vertical velocity.
 */
export function handleJumpFn(
  gameStarted: Signal<boolean>,
  gameOver: Signal<boolean>,
  birdVelocity: Signal<number>,
) {
  return $(() => {
    if (!gameStarted.value || gameOver.value) return;
    birdVelocity.value = settings.jumpStrength;
  });
}

/**
 * Function to start the game by initializing game state variables.
 * @param gameStarted - Signal indicating if the game has started.
 * @param gameOver - Signal indicating if the game is over.
 * @param score - Signal representing the current score.
 * @param birdPosition - Signal representing the bird's vertical position.
 * @param birdVelocity - Signal representing the bird's vertical velocity.
 * @param pipes - Signal containing the list of pipes in the game.
 * @param audioHtml - ID of the HTML audio element for background music.
 */
export function startGameFn(
  gameStarted: Signal<boolean>,
  gameOver: Signal<boolean>,
  score: Signal<number>,
  birdPosition: Signal<number>,
  birdVelocity: Signal<number>,
  pipes: Signal<Pipe[]>,
  audioHtml: string,
) {
  return $(() => {
    const audio = document.getElementById(audioHtml) as HTMLAudioElement | null;
    if (audio && audio.paused) {
      audio.volume = 0.5;
      audio.play().catch((err) => {
        console.warn('Audio play failed:', err);
      });
    }

    gameStarted.value = true;
    gameOver.value = false;
    score.value = 0;
    birdPosition.value = 150;
    birdVelocity.value = 0;
    pipes.value = [];
  });
}

