import { Mock } from '../mock.js'
import { MockRepository } from '../mockrepository.js'
import { Scope } from '../scope.js'

describe('scope', function () {
  class TestMock extends Mock {}
  class TestMockRepo extends MockRepository<TestMock> {}

  const repo = new TestMockRepo()

  beforeAll(() => {
    repo.save(new TestMock({ id: '1', hits: 4 }))
    repo.save(new TestMock({ id: '2', hits: 2 }))
    repo.save(new TestMock({ id: '3' }))
    repo.save(new TestMock({ id: '4' }))
  })

  test('mock scope', function () {
    const scope = new Scope(repo, repo.findByIds('1', '2', '3'))
    const one = scope.findById('1')
    const two = scope.findById('2')
    const three = scope.findById('3')
    const called = scope.findCalled()
    const pending = scope.findPending()

    expect(repo.findAll()).toHaveLength(4)
    expect(() => scope.printPending()).not.toThrow()
    expect(() => scope.findById('4')).toThrow()
    expect(one).toEqual(repo.findById('1').value)
    expect(scope.mocks).toHaveLength(3)
    expect(scope.hits()).toEqual(6)
    expect(scope.isPending()).toBeTruthy()
    expect(scope.hasBeenCalled()).toBeFalsy()
    expect(pending).toHaveLength(1)
    expect(pending[0]).toEqual(three)
    expect(called).toHaveLength(2)
    expect(called[0]).toEqual(one)

    expect(() => scope.assertHits(5)).toThrow()
    expect(() => scope.assertHits(6)).not.toThrow()
    expect(() => scope.assertCalled()).toThrow()
    expect(() => scope.assertNotCalled()).not.toThrow()

    two.inc()
    three.inc()

    expect(scope.isPending()).toBeFalsy()
    expect(scope.hasBeenCalled()).toBeTruthy()
    expect(scope.hits()).toEqual(8)
    expect(scope.findCalled()).toHaveLength(3)
    expect(scope.findPending()).toHaveLength(0)
    expect(() => scope.printPending()).not.toThrow()

    scope.delete('3')

    expect(scope.mocks).toHaveLength(2)
    expect(repo.findAll()).toHaveLength(3)
    expect(scope.isPending()).toBeFalsy()
    expect(scope.hasBeenCalled()).toBeTruthy()
    expect(scope.hits()).toEqual(7)
    expect(scope.findCalled()).toHaveLength(2)
    expect(scope.findPending()).toHaveLength(0)
  })
})
