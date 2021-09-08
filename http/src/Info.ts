interface ConnectionInfo {
  enabled: boolean
  port: number
  host: string
  baseUrl: string
}

export interface Info {
  http: ConnectionInfo
  https: ConnectionInfo
}
