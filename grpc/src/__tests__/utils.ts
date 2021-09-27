import * as ProtoLoader from '@grpc/proto-loader'
import { listFilenames } from '@mockdog/core'

export function packageDefinition(
  dir: string,
  options: ProtoLoader.Options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
): ProtoLoader.PackageDefinition {
  return ProtoLoader.loadSync(
    listFilenames(dir, file => file.includes('.proto')),
    options
  )
}
