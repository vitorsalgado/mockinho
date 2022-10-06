import { SC } from '../../http.js'
import { StandardReply } from '../StandardReply.js'
import { response } from './response.js'

export const found = (location?: string): StandardReply =>
  response().headerLocation(location).status(SC.Found)
