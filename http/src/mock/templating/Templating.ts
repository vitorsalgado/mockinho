import { Delegate } from './Delegate'

export interface Templating {
  compile(input: string): Delegate
}
