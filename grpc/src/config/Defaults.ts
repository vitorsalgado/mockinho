import { ServerCredentials } from '@grpc/grpc-js'

export const Defaults = {
  address: '0.0.0.0:50051',
  protoLoaderOptions: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
  serverCredentials: ServerCredentials.createInsecure(),
}
