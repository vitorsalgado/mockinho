import { reach } from './reach.js'

describe('reach', function () {
  const obj = {
    name: 'test',
    address: { city: 'Santiago', country: { name: 'Chile', continent: { name: 'South America' } } },
    age: 33,
    job: null,
    scholarship: undefined,
    tags: ['dev', 'travel', 'books'],
  }

  it('should return object key specified by path string', function () {
    expect(reach('name', obj)).toEqual('test')
    expect(reach('age', obj)).toEqual(33)
    expect(reach('address.city', obj)).toEqual('Santiago')
    expect(reach('address.country', obj)).toEqual({
      name: 'Chile',
      continent: { name: 'South America' },
    })
    expect(reach('address.country.continent.name', obj)).toEqual('South America')
  })

  it('should get array items by index', function () {
    expect(reach('tags[1]', obj)).toEqual('travel')
  })

  it('should return null when a object key is not found', function () {
    expect(reach('nonexistent', obj)).toBeNull()
  })

  it('should return array value', function () {
    expect(reach('tags', obj)).toEqual(['dev', 'travel', 'books'])
  })

  it('should return a undefined key as null', function () {
    expect(reach('scholarship', obj)).toBeNull()
  })

  it('should return a null key as is', function () {
    expect(reach('job', obj)).toBeNull()
  })
})
