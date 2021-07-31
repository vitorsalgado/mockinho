import { Stream } from 'stream'
import { BodyType } from '../../pkg/http/types'

export const convertBodyToJSON = (body: BodyType | Record<string, unknown>): BodyType => {
  if (body && typeof body === 'object' && !(body instanceof Stream) && !(body instanceof Buffer)) {
    return JSON.stringify(body)
  } else {
    return body
  }
}
