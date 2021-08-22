import { Mock } from './Mock'

export interface Plugin<Req, M extends Mock> {
  name: string

  onStart?: () => Promise<void>

  onMockInit?: (mock: M) => M

  onRequestVerification?: (mock: M, request: Req) => boolean

  onClean?: () => Promise<void>

  onFinalize?: () => Promise<void>
}
