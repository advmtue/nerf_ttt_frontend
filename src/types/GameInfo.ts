export default interface GameInfo {
  role: string;
  analyzerCode: string;
  knownRoles: GamePlayerBasic[];

  scansRemaining?: number;
  lastScanTime?: number;
}

export interface GamePlayerBasic {
  displayName: string;
  role: string;
}