import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const notModified = (): StandardReply => response().status(SC.NotModified)
