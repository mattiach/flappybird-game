import type { IGameSettings, Pipe } from "@/interfaces/const";
import { settings } from "@/settings/game.settings";
import { $, type Signal } from "@builder.io/qwik";

/**
 * Function to handle key events for starting the game and jumping.
 * @param gameStarted - Signal indicating if the game has started.
 * @param startGame - Function to start the game.
 * @param gameOver - Signal indicating if the game is over.
 * @param birdSpeed - Signal representing the bird's vertical velocity.
 */
export function keyListenerFn(
  gameStarted: Signal<boolean>,
  startGame: () => void,
  gameOver: Signal<boolean>,
  birdSpeed: Signal<number>,
) {
  return (e: KeyboardEvent) => {
    if (e.code === "Space") {
      if (!gameStarted.value || gameOver.value) {
        startGame();
      } else {
        birdSpeed.value = settings.jumpStrength;
      }
    }
  };
}

/**
 * Function to handle the jump action of the bird.
 * @param gameStarted - Signal indicating if the game has started.
 * @param gameOver - Signal indicating if the game is over.
 * @param birdSpeed - Signal representing the bird's vertical velocity.
 */
export function handleJumpFn(
  gameStarted: Signal<boolean>,
  gameOver: Signal<boolean>,
  birdSpeed: Signal<number>,
) {
  return $(() => {
    if (!gameStarted.value || gameOver.value) return;
    birdSpeed.value = settings.jumpStrength;
  });
}

/**
 * Function to start the game by initializing game state variables.
 * @param gameStarted - Signal indicating if the game has started.
 * @param gameOver - Signal indicating if the game is over.
 * @param score - Signal representing the current score.
 * @param birdPosition - Signal representing the bird's vertical position.
 * @param birdSpeed - Signal representing the bird's vertical velocity.
 * @param pipes - Signal containing the list of pipes in the game.
 * @param audioHtml - ID of the HTML audio element for background music.
 */
export function startGameFn(
  gameStarted: Signal<boolean>,
  gameOver: Signal<boolean>,
  score: Signal<number>,
  birdPosition: Signal<number>,
  birdSpeed: Signal<number>,
  pipes: Signal<Pipe[]>,
  audioHtml: string,
) {
  return $(() => {
    const audio = document.getElementById(audioHtml) as HTMLAudioElement | null;
    if (audio && audio.paused) {
      audio.volume = 0.5;
      audio.play().catch((err) => {
        console.warn("Audio play failed:", err);
      });
    }

    gameStarted.value = true;
    gameOver.value = false;
    score.value = 0;
    birdPosition.value = 150;
    birdSpeed.value = 0;
    pipes.value = [];
  });
}



/**
 * Detects the browser from the userAgent string and applies
 * specific game setting adjustments to improve performance
 * on certain browsers.
 * 
 * @param userAgent - The browser's userAgent string.
 * @param settings - The default game settings.
 * @param setBrowser - Callback to update the detected browser name.
 * @param setGameSettings - Callback to update the adjusted game settings.
 */
export function detectBrowserSettings(
  userAgent: string,
  settings: IGameSettings,
  setBrowser: (browserName: string) => void,
  setGameSettings: (newSettings: Partial<IGameSettings>) => void
) {
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    setBrowser("Chrome");
  } else if (userAgent.includes("Firefox")) {
    setBrowser("Firefox");
    // Firefox fix performance
    setGameSettings({
      gravity: settings.gravity * 0.75,
      pipeSpeed: settings.pipeSpeed * 0.85,
    });
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    setBrowser("Safari");
  } else if (userAgent.includes("Edg")) {
    setBrowser("Edge");
  } else {
    setBrowser("Unknown Browser");
  }
}