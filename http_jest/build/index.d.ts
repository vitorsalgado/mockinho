import { MockDogHttp } from '@mockdog/http'
import { MockDogHttpEnvironment } from './MockDogHttpEnvironment.js'

export { MockDogHttpEnvironment as default }

declare global {
  const mockhttp: MockDogHttp
}

export = MockDogHttpEnvironment;
