import { Stream } from 'stream'

export const convertBodyToJSON = (body: any): string => {
  if (body && typeof body === 'object' && !(body instanceof Stream) && !(body instanceof Buffer)) {
    return JSON.stringify(body)
  } else {
    return ''
  }
}
