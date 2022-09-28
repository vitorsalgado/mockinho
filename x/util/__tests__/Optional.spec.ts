import { fromNullable } from '../index.js'
import { Optional } from '../index.js'
import { empty } from '../index.js'

describe('Optional', function () {
  it('should throw error when using .of() with null value', function () {
    expect(() => Optional.of(null)).toThrow()
  })

  describe('when optional data is present', function () {
    it('should get the provided data', function () {
      const test = 'test'
      const opt = Optional.of(test)

      expect(opt.get()).toEqual(test)
      expect(opt.orValue('def')).toEqual(test)
    })

    it('should inform data is present when it is not null', function () {
      const test = 'test'
      const opt = fromNullable(test)

      expect(opt.isPresent()).toBeTruthy()
      expect(opt.isEmpty()).toBeFalsy()
    })

    it('should get a optional with data from mapper', function () {
      const test = 'test'
      const opt = Optional.ofNullable(test).map(value => `${value}+01`)

      expect(opt.get()).toEqual('test+01')
      expect(opt.orValue('def')).not.toEqual('def')
    })

    it('should execute .ifPresent() function only if there is any data available', function () {
      const fnFull = jest.fn()
      const fnEmpty = jest.fn()
      const full = Optional.of('test')
      const empty = Optional.empty()

      full.ifPresent(fnFull)
      empty.ifPresent(fnEmpty)

      expect(fnFull).toBeCalledTimes(1)
      expect(fnEmpty).not.toHaveBeenCalled()
    })
  })

  describe('when map with no data present', function () {
    it('should return empty optional', function () {
      const opt = Optional.empty().map(value => `${value}+01`)

      expect(opt.isEmpty()).toBeTruthy()
    })

    it('should return empty optional when calling .empty()', function () {
      expect(Optional.empty().isEmpty()).toBeTruthy()
      expect(empty().isEmpty()).toBeTruthy()
    })
  })

  describe('when optional is empty', function () {
    it('should return default value when calling .orValue()', function () {
      const empty = Optional.empty()
      const present = Optional.of('hey')

      expect(empty.orValue('test')).toEqual('test')
      expect(present.orValue('other')).toEqual('hey')
    })

    it('should return undefined when calling .orNothing()', function () {
      const empty = Optional.empty()
      const present = Optional.of('hey')

      expect(empty.orNothing()).toBeUndefined()
      expect(present.orNothing()).toEqual('hey')
    })
  })
})
