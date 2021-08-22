import type { Socket } from 'socket.io'

export interface SessionSocket extends Socket {
    request: SessionIncomingMessage
}
