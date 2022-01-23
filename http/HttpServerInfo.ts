interface ConnectionInfo {
  enabled: boolean
  port: number
  host: string
  baseUrl: string
}

export interface HttpServerInfo {
  http: ConnectionInfo
  https: ConnectionInfo
}
