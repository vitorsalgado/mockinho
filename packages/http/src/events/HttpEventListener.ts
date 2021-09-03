import EventEmitter from 'events'
import { HttpEvents } from './HttpEvents'

export class HttpEventListener extends EventEmitter {
  on<E extends keyof HttpEvents>(event: E, listener: (args: HttpEvents[E]) => void): this {
    super.on(event, listener)
    return this
  }

  emit<E extends keyof HttpEvents>(event: E, args?: HttpEvents[E]): boolean {
    return super.emit(event, args)
  }
}
