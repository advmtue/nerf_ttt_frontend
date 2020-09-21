export default interface SocketMessage<T> {
  scopeId: string;
  payload: T;
}