import { v1, v4 } from 'uuid'
import { isUUID } from '../isUUID'

describe('isUUID', function () {
  it('should return true for a valid UUID', function () {
    expect(isUUID()(v1())).toBeTruthy()
    expect(isUUID()(v4())).toBeTruthy()
    expect(isUUID()('7f428f62-16af-4fe8-b3ac-b3e87bc02d71')).toBeTruthy()
    expect(isUUID()('560bd5e4-ee8f-11eb-9a03-0242ac130003')).toBeTruthy()
  })

  it('should return false for invalid uuids', function () {
    expect(isUUID()('random text')).toBeFalsy()
    expect(isUUID()('dnjsakndsaidojalndkasnd0iq2u09pedjasnkfna')).toBeFalsy()
    expect(isUUID()('5559990')).toBeFalsy()
  })
})
