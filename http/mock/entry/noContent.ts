import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const noContent = (): StandardReply => response().status(SC.NoContent)
