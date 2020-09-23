export default interface GameMetadata {
  code: string;

  dateCreated: string;
  dateLaunched: string;
  dateStarted: string;
  dateEnded: string;

  ownerId: string;
  ownerName: string;
  
  status: string;
  winningTeam: string;
  nextGameCode: string;
}
