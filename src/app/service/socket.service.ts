import { Injectable, Inject } from '@angular/core';
import { TokenService } from './token.service';
import { RxStomp } from '@stomp/rx-stomp';
import { map, pluck, tap } from 'rxjs/operators';
import { IMessage } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private stomp: RxStomp;

  constructor(
    private tokenService: TokenService,
    @Inject('WEBSOCKET_URL') private websocketUrl: string
  ) {
    // Instantiate stomp
    this.stomp = new RxStomp();

    // Listen to token events
    this.tokenService.tokenStatus.subscribe(this.tokenChangeStatus.bind(this));
  }

  private tokenChangeStatus(tokenStatus: string) {
    if (tokenStatus === 'ACQUIRED') {
      console.log('Socket client configuring connection');

      this.stomp.configure({
        brokerURL: this.websocketUrl,
        connectHeaders: {
          authToken: this.tokenService.accessToken
        },
        heartbeatIncoming: 20000,
        heartbeatOutgoing: 10000,
        reconnectDelay: 200
      });

      this.stomp.activate();
    } else if (tokenStatus === 'NONE') {
      console.log('Token was removed :: deactivating stomp');
      this.stomp.deactivate();
    }
  }

  // Type generic function for watching a topic
  public watchPath<T>(location: string) {
    return this.stomp.watch(location).pipe(
      pluck<IMessage, string>('body'),         // Take .body from IMessage
      map<string, T>(b => JSON.parse(b) as T), // Parse body json to T
      tap<T>(console.log)
    );
  }
}
