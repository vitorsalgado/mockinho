import { isUUID } from '../isUUID.js'

describe('isUUID', function () {
  const v1UUID = '478a6e30-6cf3-11ec-8a13-23d3bb133a53'
  const v4UUID = '7534e034-fc4f-4d71-ab48-f644f234f035'

  it('should return true for a valid UUID', function () {
    expect(isUUID()(v1UUID).pass).toBeTruthy()
    expect(isUUID()(v4UUID).pass).toBeTruthy()
    expect(isUUID()('7f428f62-16af-4fe8-b3ac-b3e87bc02d71').pass).toBeTruthy()
    expect(isUUID()('560bd5e4-ee8f-11eb-9a03-0242ac130003').pass).toBeTruthy()
  })

  it('should return false for invalid uuids', function () {
    expect(isUUID()('random text').pass).toBeFalsy()
    expect(isUUID()('dnjsakndsaidojalndkasnd0iq2u09pedjasnkfna').pass).toBeFalsy()
    expect(isUUID()('5559990').pass).toBeFalsy()
  })
})
