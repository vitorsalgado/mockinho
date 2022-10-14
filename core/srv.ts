export interface Server<I = unknown, A = unknown> {
  setup(): void

  start(): Promise<I>

  close(): Promise<void>

  get info(): I

  get instance(): A
}
