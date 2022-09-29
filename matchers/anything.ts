import { Matcher } from './base/index.js'
import { res } from './internal/res.js'

export const anything = (): Matcher => () => res('anything', () => '', true)
