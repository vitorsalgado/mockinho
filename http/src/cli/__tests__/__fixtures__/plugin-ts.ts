import { get } from '../../../mock'
import { okJSON } from '../../../mock'
import { MockDogHttp } from '../../../MockDogHttp'
import { Configuration } from '../../../config'

export default function (instance: MockDogHttp, _config: Configuration, _opts: unknown): void {
  instance.mock(get('/ts/plugin').reply(okJSON({ hello: 'world', ctx: 'ts' })))
}
