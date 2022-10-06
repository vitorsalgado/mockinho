import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const movedPermanently = (location?: string): StandardReply =>
  response().status(SC.Moved_Permanently).headerLocation(location)
