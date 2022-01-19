/**
 * @description Classe para tratar o socket.io
 * @author GuilhermeSantos001
 * @update 10/01/2022
 */

import * as SocketIO from 'socket.io-client';

import signURL from '@/src/functions/signURL'

export default class SocketEX {
  private socketIO!: SocketIO.Socket;
  private reconnectionAttempts!: number;
  private reconnectionDelay!: number;
  private reconnectionDelayMax!: number;
  private reconnection!: boolean;

  constructor() {
    return this.initialize.call(this, arguments);
  }

  private async initialize(
    reconnectionAttempts = 10,
    reconnectionDelay= 1000,
    reconnectionDelayMax = 5000,
    reconnection = true
  ) {
    this.reconnectionAttempts = reconnectionAttempts;
    this.reconnectionDelay = reconnectionDelay;
    this.reconnectionDelayMax = reconnectionDelayMax;
    this.reconnection = reconnection;
    this.socketIO = SocketIO.io(process.env.NEXT_PUBLIC_WEBSOCKET_HOST, {
      reconnectionAttempts: this.reconnectionAttempts,
      reconnectionDelay: this.reconnectionDelay,
      reconnectionDelayMax: this.reconnectionDelayMax,
      reconnection: this.reconnection,
      auth: {
        signedUrl: await signURL()
      },
      secure: process.env.NODE_ENV === 'production'
    });
  }

  public socket(): SocketIO.Socket {
    return this.socketIO;
  }
}