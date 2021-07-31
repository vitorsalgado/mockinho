import { empty, fromNullable, Optional } from '../Optional'

describe('Optional', function () {
  it('should throw error when using .of() with null value', function () {
    expect(() => Optional.of(null)).toThrow()
  })

  it('should inform data is present when it is not null', function () {
    const test = 'test'
    const opt = fromNullable(test)

    expect(opt.isPresent()).toBeTruthy()
    expect(opt.isEmpty()).toBeFalsy()
  })

  it('should get the provided data', function () {
    const test = 'test'
    const opt = Optional.of(test)

    expect(opt.get()).toEqual(test)
    expect(opt.orValue('def')).toEqual(test)
  })

  it('should get the mapped data', function () {
    const test = 'test'
    const opt = Optional.ofNullable(test).map(value => `${value}+01`)

    expect(opt.get()).toEqual('test+01')
    expect(opt.orValue('def')).not.toEqual('def')
  })

  it('should return empty optional when calling .empty()', function () {
    expect(Optional.empty().isEmpty()).toBeTruthy()
    expect(empty().isEmpty()).toBeTruthy()
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

  // it('.or() should return the function value when optional is empty', function () {
  //   const opt1 = Optional.empty()
  //   const opt2 = Optional.of('test')
  //
  //   expect(opt1.or(() => 'test')).toEqual('test')
  //   expect(opt2.or(() => 'dev')).toEqual('test')
  // })

  it('should return undefined when calling .nothing() with empty optional', function () {
    const opt1 = Optional.empty()
    const opt2 = Optional.of('test')
    expect(opt1.orNothing()).toBeUndefined()
    expect(opt2.orNothing()).toEqual('test')
  })
})
