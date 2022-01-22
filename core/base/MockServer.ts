export interface MockServer<I = unknown> {
  initialSetup(): void

  start(): Promise<I>

  close(): Promise<void>

  info(): I
}
