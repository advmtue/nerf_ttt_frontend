interface Player {
  userId: string;
  displayName: string;
}

export interface LobbyPlayer extends Player {
  isReady: boolean;
}

export interface GamePlayer extends Player {
  isAlive: boolean;
  role: string;
  killerId: string;
  analyzerCode: string;
  scansRemainging: number;
  lastScanTime: string;
}

export interface GamePlayerBasic extends Player {
  role: string;
}
