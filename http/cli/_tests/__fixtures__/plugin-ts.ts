import { get } from '../../../mock/index.js'
import { okJSON } from '../../../mock/index.js'
import { MockDogHttp } from '../../../MockDogHttp.js'
import { HttpConfiguration } from '../../../config/index.js'

export default function (instance: MockDogHttp, _config: HttpConfiguration, _opts: unknown): void {
  instance.mock(get('/ts/plugin').reply(okJSON({ hello: 'world', ctx: 'ts' })))
}
