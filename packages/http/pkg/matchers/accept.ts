import { Matcher } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'

export const accept = (matcher: Matcher<string>): Matcher<HttpRequest> => {
  return function accept(request, ctx): boolean {
    return matcher(request.headers.accept, ctx)
  }
}
