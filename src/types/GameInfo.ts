export default interface GameInfo {
  role: string;
  analyzerCode: string;
  players: GamePlayerBasic[];

  scansRemaining?: number;
  lastScanTime?: number;
}

export interface GamePlayerBasic {
  name: string;
  role: string;
}