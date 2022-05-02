import { useEffect } from 'react';

import { SocketConnectionController } from '../controllers/SocketConnectionController';

declare global {
  interface Window {
    socket: SocketConnectionController
  }
}

const socket = new SocketConnectionController();

export function SocketConnection() {
  useEffect(() => {
    window.socket = socket;

    return () => {
      if (window.socket)
        window.socket.removeAllListeners();
    }
  }, []);

  return <></>
}