export default interface GameInfo {
  role: string;
  analyzerCode: string;
  knownPlayers: GamePlayerBasic[];

  scansRemaining?: number;
  lastScanTime?: number;
}

export interface GamePlayerBasic {
  displayName: string;
  role: string;
}