import { MockDogHttp } from '@mockdog/http'
import { MockDogHttpEnvironment } from './MockDogHttpEnvironment'

export { MockDogHttpEnvironment as default }

declare global {
  const mockhttp: MockDogHttp;
}

export = MockDogHttpEnvironment;
