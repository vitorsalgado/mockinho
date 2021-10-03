export type Helper = {
  [name: string]: (...args: Array<never>) => string | number | boolean
}
