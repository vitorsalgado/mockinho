export interface MockServer<I = unknown> {
  setup(): void

  start(): Promise<I>

  close(): Promise<void>

  info(): I
}
