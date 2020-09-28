import GameKill from './GameKill';
import { GamePlayer, GamePlayerBasic, LobbyPlayer } from './Player';

export default interface GameInfo {
  code: string;
  ownerId: string;
  ownerName: string;
  status: string;

  dateCreated: string;
  dateLaunched: string;
  dateStarted: string;
  dateEnded: string;

  nextGameCode: string;
  winningTeam: string;

  localPlayer: GamePlayer;
  lobbyPlayers: LobbyPlayer[];
  gamePlayers: GamePlayerBasic[];
  waitingFor: GamePlayerBasic[];
  kills: GameKill[];
}