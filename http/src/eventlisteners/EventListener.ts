import EventEmitter from 'events'
import { Events } from './Events'

export class EventListener extends EventEmitter {
  on<E extends keyof Events>(event: E, listener: (args: Events[E]) => void): this {
    super.on(event, listener)
    return this
  }

  emit<E extends keyof Events>(event: E, args?: Events[E]): boolean {
    return super.emit(event, args)
  }
}
