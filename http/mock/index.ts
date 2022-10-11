import { anyMethod, get, post, put, del, patch, head, request } from './httpmock_builder.js'

export * from './reply/standard_reply.js'
export * from './httpmock.js'
export * from './httpmock_builder.js'
export { Reply } from './reply/reply.js'
export { SrvResponse } from './reply/reply.js'
export * from './reply/index.js'

export const req = { anyMethod, get, post, put, del, patch, head, request }
