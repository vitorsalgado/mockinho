import { reach } from '../index.js'

describe('reach', function () {
  const obj = {
    name: 'test',
    address: { city: 'Santiago', country: { name: 'Chile', continent: { name: 'South America' } } },
    age: 33,
    job: null,
    scholarship: undefined,
    tags: ['dev', 'travel', 'books']
  }

  it('should return object key specified by path string', function () {
    const name = 'name'
    const age = 'age'
    const city = 'address.city'
    const country = 'address.country'
    const continentName = 'address.country.continent.name'

    expect(reach(name, obj)).toEqual('test')
    expect(reach(age, obj)).toEqual(33)
    expect(reach(city, obj)).toEqual('Santiago')
    expect(reach(country, obj)).toEqual({
      name: 'Chile',
      continent: { name: 'South America' }
    })
    expect(reach(continentName, obj)).toEqual('South America')
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
