import { v1, v4 } from 'uuid'
import { isUUID } from '../isUUID'
import { fakeMatcherContext } from './testUtils'

describe('isUUID', function () {
  it('should return true for a valid UUID', function () {
    expect(isUUID()(v1(), fakeMatcherContext())).toBeTruthy()
    expect(isUUID()(v4(), fakeMatcherContext())).toBeTruthy()
    expect(isUUID()('7f428f62-16af-4fe8-b3ac-b3e87bc02d71', fakeMatcherContext())).toBeTruthy()
    expect(isUUID()('560bd5e4-ee8f-11eb-9a03-0242ac130003', fakeMatcherContext())).toBeTruthy()
  })

  it('should return false for invalid uuids', function () {
    expect(isUUID()('random text', fakeMatcherContext())).toBeFalsy()
    expect(isUUID()('dnjsakndsaidojalndkasnd0iq2u09pedjasnkfna', fakeMatcherContext())).toBeFalsy()
    expect(isUUID()('5559990', fakeMatcherContext())).toBeFalsy()
  })
})
