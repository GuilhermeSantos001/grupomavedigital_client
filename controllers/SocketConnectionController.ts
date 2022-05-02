import { io, Socket } from 'socket.io-client';

import { compressToBase64, decompressFromBase64 } from 'lz-string';

export class SocketConnectionController {
    socket: Socket

    constructor(ip: string) {
        this.socket = io(ip, {
            path: '/seacher',
            transports: ['websocket'],
        });
        this.socket.io.on("error", (error) => console.log(`Socket.io error ->`, error));
        this.socket.io.on("close", (reason) => console.log(`Socket.io close ->`, reason));
        this.socket.on("connect", () => console.log("Socket.io connect"));
        this.socket.on("connect_error", (error) => console.log(`Socket error ->`, error));
        this.socket.on("disconnect", (reason) => console.log(`Socket disconnect ->`, reason));
    }

    public compress<DataType>(data: DataType) {
        return compressToBase64(JSON.stringify(data));
    }

    public decompress<ReturnType>(data: string): ReturnType {
        return JSON.parse(decompressFromBase64(data) || "");
    }

    public hasListeners(event: string) {
        return this.socket.hasListeners(event);
    }

    public off(event: string) {
        this.socket.off(event);
    }

    public emit(event: string, ...args: string[]) {
        this.socket.emit(event, ...args);
    }

    public on(event: string, handle: (...args: string[]) => void) {
        if (this.hasListeners(event))
            this.off(event);

        this.socket.on(event, handle);
    }

    public removeAllListeners() {
        this.socket.removeAllListeners();
    }
}