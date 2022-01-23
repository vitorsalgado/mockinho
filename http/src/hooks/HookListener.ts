import EventEmitter from 'events'
import { Hooks } from './Hooks.js'

export class HookListener extends EventEmitter {
  on<E extends keyof Hooks>(event: E, listener: (args: Hooks[E]) => void): this {
    super.on(event, listener)
    return this
  }

  emit<E extends keyof Hooks>(event: E, args?: Hooks[E]): boolean {
    return super.emit(event, args)
  }
}
