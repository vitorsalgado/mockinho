export type Mode = 'silent' | 'info' | 'verbose' | 'trace'

export const Modes: Record<string, number> = {
  silent: 10,
  info: 20,
  verbose: 30,
  trace: 40,
}
