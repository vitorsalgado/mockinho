import { get } from '../../../mock'
import { okJSON } from '../../../mock'
import { MockaccinoHttp } from '../../../MockaccinoHttp'
import { Configuration } from '../../../config'

export default function (instance: MockaccinoHttp, _config: Configuration, _opts: unknown): void {
  instance.mock(get('/ts/plugin').reply(okJSON({ hello: 'world', ctx: 'ts' })))
}
