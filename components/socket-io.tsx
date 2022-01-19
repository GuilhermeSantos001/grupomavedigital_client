/**
 * @description Componente -> Socket.io
 * @author GuilhermeSantos001
 * @update 18/01/2022
 */

import { useState, useEffect } from 'react';

import * as SocketIOClient from 'socket.io-client';

import signURL from '@/src/functions/signURL'

import Alerting from '@/src/utils/alerting'

declare global {
  interface Window {
    socket: SocketIOClient.Socket
    socketUtils: {
      emitDelay: number
    }
  }
}

export default function SocketIO() {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      const
        timeout = setTimeout(async () => {
          const socket = SocketIOClient.io(process.env.NEXT_PUBLIC_WEBSOCKET_HOST, {
            reconnectionAttempts: 10,
            reconnection: true,
            auth: {
              signedUrl: await signURL()
            },
            secure: process.env.NODE_ENV === 'production',
          });

          // ? Evento emitido quando o usuário se conecta ao servidor
          if (!socket.hasListeners('connect'))
            socket.on("connect", async () => {
              Alerting.create('info', 'Você está conectado!');
            });

          // ? Evento emitido quando o usuário se reconecta com o servidor
          if (!socket.hasListeners('reconnect'))
            socket.on("reconnect", () => {
              Alerting.create('info', 'Você está conectado novamente!');
            });

          // ? Evento emitido quando a conexão do usuário é perdida
          if (!socket.hasListeners('connect_error'))
            socket.on("connect_error", (error) => {
              Alerting.create('error', 'Ocorreu um erro na conexão com o servidor. Tente novamente, mais tarde!');
              console.error(error);
            });

          // ? Evento emitido quando a conexão do usuário é desconectada
          if (!socket.hasListeners('disconnect'))
            socket.on("disconnect", (reason) => {
              Alerting.create('warning', `Conexão perdida com o servidor.`);
              console.error(reason);
            });

          setSocket(socket);
          clearTimeout(timeout);
        }, 1000);
    }

    const interval = setInterval(() => {
      if (socket) {
        const
          ping = 'CONNECTION_PING',
          pong = 'CONNECTION_PONG';

        if (socket.hasListeners(pong))
          socket.off(pong);

        socket.on(pong, () => {
          if (process.env.NODE_ENV === 'development')
            console.warn('WEBSOCKET -> SERVER IS ALIVE!');
        });

        socket.emit(ping);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  window.socket = socket;

  if (!window.socketUtils)
    window.socketUtils = {
      emitDelay: 2000
    }

  return <></>
}