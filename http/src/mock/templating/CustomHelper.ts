export type CustomHelper = {
  [name: string]: (...args: Array<never>) => string | number | boolean
}
