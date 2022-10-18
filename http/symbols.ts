const kInternals: unique symbol = Symbol('lhamajs.request.internals')
const kContext: unique symbol = Symbol('lhamajs.request.context')

export { kInternals }
export { kContext }

export const keys = { kInternals, kContext }
