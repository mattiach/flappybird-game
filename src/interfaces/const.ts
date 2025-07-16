export interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed?: boolean;
}

export interface Hitbox {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface IGameSettings {
  gravity: number;
  jumpStrength: number;
  pipeWidth: number;
  pipeGap: number;
  pipeSpeed: number;
  defaultCharacter: string;
};
