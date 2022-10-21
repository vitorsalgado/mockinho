import { Mock } from '../mock.js'
import { MockRepository } from '../mockrepository.js'

describe('MockInMemoryRepository', function () {
  class TestRepo extends MockRepository<Mock> {}

  const repo = new TestRepo()

  it('ensure repository workflow', function () {
    const mock1 = new Mock({
      id: 'test-id-1',
      name: 'test',
      priority: 1,
      enabled: true,
      source: 'code',
      sourceDetail: 'desc',
    })
    const mock2 = new Mock({
      id: 'test-id-2',
      name: 'test',
      priority: 2,
      enabled: true,
      source: 'code',
      sourceDetail: 'desc',
    })
    const mock3 = new Mock({
      id: 'test-id-3',
      name: 'test',
      priority: 3,
      enabled: true,
      source: 'code',
      sourceDetail: 'desc',
    })
    const mock4 = new Mock({
      id: 'test-id-4',
      name: 'test',
      priority: 4,
      enabled: true,
      source: 'file',
      sourceDetail: 'desc',
    })
    const mock5 = new Mock({
      id: 'test-id-5',
      name: 'test',
      priority: 5,
      enabled: true,
      source: 'file',
      sourceDetail: 'desc',
    })
    const mock6 = new Mock({
      id: 'test-id-6',
      name: 'test',
      priority: 6,
      enabled: true,
      source: 'code',
      sourceDetail: 'desc',
    })
    const mock7 = new Mock({
      id: 'test-id-7',
      name: 'test',
      priority: 7,
      enabled: true,
      source: 'code',
      sourceDetail: 'desc',
      postActions: [],
      matchers: [],
      hits: 0,
    })

    repo.save(mock3)
    repo.save(mock5)
    repo.save(mock1)
    repo.save(mock6)
    repo.save(mock2)
    repo.save(mock4)
    repo.save(mock7)

    const sorted = repo.findEligible()

    expect(sorted[0].id).toEqual('test-id-1')
    expect(sorted[1].id).toEqual('test-id-2')
    expect(sorted[2].id).toEqual('test-id-3')
    expect(sorted[3].id).toEqual('test-id-4')
    expect(sorted[4].id).toEqual('test-id-5')
    expect(sorted[5].id).toEqual('test-id-6')
    expect(sorted[6].id).toEqual('test-id-7')

    const byId = repo.findById('test-id-2')

    expect(byId.isPresent()).toBeTruthy()
    expect(byId.get().id).toEqual('test-id-2')

    const byIds = repo.findByIds('test-id-1', 'test-id-3', 'anything', '100')

    expect(byIds).toHaveLength(2)
    expect(byIds[0].id).toEqual('test-id-1')
    expect(byIds[1].id).toEqual('test-id-3')

    repo.deleteById('test-id-1')

    const removed = repo.findById('test-id-1')

    expect(removed.isPresent()).toBeFalsy()

    repo.deleteById('test-id-2', 'test-id-3')

    const removedList = repo.findByIds('test-id-2', 'test-id-3')

    expect(removedList).toHaveLength(0)

    repo.deleteBySource('code')

    const fileSource = repo.findEligible()

    expect(fileSource).toHaveLength(2)
    expect(fileSource[0].id).toEqual('test-id-4')
    expect(fileSource[1].id).toEqual('test-id-5')

    repo.clear()

    const leftover = repo.findEligible()

    expect(leftover).toHaveLength(0)
  })
})
