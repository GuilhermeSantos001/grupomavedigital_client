/**
 * @description Componente -> Socket.io
 * @author GuilhermeSantos001
 * @update 10/01/2022
 */

import { useState, useEffect } from 'react';

import * as SocketIOClient from 'socket.io-client';

import signURL from '@/src/functions/signURL'

declare global {
  interface Window {
    socket: SocketIOClient.Socket;
  }
}

export default function SocketIO() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {

      const socket = SocketIOClient.io(process.env.NEXT_PUBLIC_WEBSOCKET_HOST, {
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnection: true,
        auth: {
          signedUrl: await signURL()
        },
        secure: process.env.NODE_ENV === 'production',
      });

      setSocket(socket);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  window.socket = socket;

  return <></>
}