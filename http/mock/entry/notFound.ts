import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const notFound = (): StandardReply => response().status(SC.NotFound)

export const notFoundJSON = (body: JsonType): StandardReply => notFound().bodyJSON(body)
