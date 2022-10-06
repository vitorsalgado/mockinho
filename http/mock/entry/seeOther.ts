import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const seeOther = (location?: string): StandardReply =>
  response().status(SC.SeeOther).headerLocation(location)
