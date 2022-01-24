/**
 * @description Componente -> Socket.io
 * @author GuilhermeSantos001
 * @update 24/01/2022
 */

import { useEffect } from 'react';

import SocketConnectionController from '../controllers/SocketConnectionController';

declare global {
  interface Window {
    socket: SocketConnectionController
  }
}

const socket = new SocketConnectionController(String(process.env.NEXT_PUBLIC_WEBSOCKET_HOST));

export default function SocketConnectionComponent() {
  useEffect(() => {
    window.socket = socket;

    return () => {
      if (socket)
        socket.removeAllListeners();
    }
  }, []);

  return <></>
}