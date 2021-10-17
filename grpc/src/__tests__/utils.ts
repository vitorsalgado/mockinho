import Path from 'path'
import { PackageDefinition } from '@grpc/proto-loader'
import * as ProtoLoader from '@grpc/proto-loader'

const paths = [
  Path.join(__dirname, 'proto', 'chat.proto'),
  Path.join(__dirname, 'proto', 'cities.proto')
]

const packageDefinition = ProtoLoader.loadSync(paths, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

export function getPackageDefinition(): PackageDefinition {
  return packageDefinition
}
