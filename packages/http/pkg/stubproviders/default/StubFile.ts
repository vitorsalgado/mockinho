export interface StubFile {
  id: string
  priority: number
  name: string

  scenario: {
    name: string
    requiredState: string
    newState: string
  }

  request: {
    method: string
    url: string
    urlPath: string
    urlPattern: string
    urlPathPattern: string
    querystring: Record<string, string | Record<string, string>>
    headers: Record<string, string | Record<string, string>>
    body: string | Record<string, string | Record<string, string>>
    bodyFile: string
    files: Record<string, Record<string, string>>

    [key: string]: unknown
  }

  response: {
    status: number
    headers: Record<string, string>
    proxyHeaders: Record<string, string>
    proxyFrom: string
    body: unknown
    bodyFile: string
    delayInMs: number

    [key: string]: unknown
  }

  [key: string]: unknown
}
