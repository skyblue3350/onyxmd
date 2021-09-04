import type { Socket } from 'socket.io'
import { Delta } from './ace';

export interface SessionSocket extends Socket {
    request: SessionIncomingMessage
}
