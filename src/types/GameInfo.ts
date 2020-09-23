export default interface GameInfo {
  role: string;
  analyzerCode: string;
  players: GamePlayerBasic[];
  alive: boolean;

  scansRemaining?: number;
  lastScanTime?: number;
}

export interface GamePlayerBasic {
  userId: string;
  name: string;
  role: string;
}