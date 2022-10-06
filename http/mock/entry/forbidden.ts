import { JsonType } from '@mockdog/x'
import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const forbidden = (): StandardReply => response().status(SC.Forbidden)

export const forbiddenJSON = (body: JsonType): StandardReply => forbidden().bodyJSON(body)
