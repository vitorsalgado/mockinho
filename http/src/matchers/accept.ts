import { Matcher } from '@mockinho/core'
import { HttpRequest } from '../HttpRequest'

export const accept = (matcher: Matcher<string>): Matcher<HttpRequest> =>
  function accept(request): boolean {
    return matcher(request.headers.accept)
  }
