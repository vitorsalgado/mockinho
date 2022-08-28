import { MockInMemoryRepository } from '../MockInMemoryRepository'
import { Mock } from '../Mock'

describe('MockInMemoryRepository', function () {
  class TestRepo extends MockInMemoryRepository<Mock> {
    public constructor() {
      super()
    }
  }

  const repo = new TestRepo()

  it('ensure repository workflow', function () {
    const mock1 = new Mock(
      'test-id-1',
      'test',
      1,
      'code',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )
    const mock2 = new Mock(
      'test-id-2',
      'test',
      2,
      'code',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )
    const mock3 = new Mock(
      'test-id-3',
      'test',
      3,
      'code',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )
    const mock4 = new Mock(
      'test-id-4',
      'test',
      4,
      'file',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )
    const mock5 = new Mock(
      'test-id-5',
      'test',
      5,
      'file',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )
    const mock6 = new Mock(
      'test-id-6',
      'test',
      6,
      'code',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )
    const mock7 = new Mock(
      'test-id-7',
      'test',
      7,
      'code',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>(),
    )

    repo.save(mock3)
    repo.save(mock5)
    repo.save(mock1)
    repo.save(mock6)
    repo.save(mock2)
    repo.save(mock4)
    repo.save(mock7)

    const sorted = repo.fetchSorted()

    expect(sorted[0].id).toEqual('test-id-1')
    expect(sorted[1].id).toEqual('test-id-2')
    expect(sorted[2].id).toEqual('test-id-3')
    expect(sorted[3].id).toEqual('test-id-4')
    expect(sorted[4].id).toEqual('test-id-5')
    expect(sorted[5].id).toEqual('test-id-6')
    expect(sorted[6].id).toEqual('test-id-7')

    const byId = repo.fetchById('test-id-2')

    expect(byId.isPresent()).toBeTruthy()
    expect(byId.get().id).toEqual('test-id-2')

    const byIds = repo.fetchByIds('test-id-1', 'test-id-3', 'anything', '100')

    expect(byIds).toHaveLength(2)
    expect(byIds[0].id).toEqual('test-id-1')
    expect(byIds[1].id).toEqual('test-id-3')

    repo.removeById('test-id-1')

    const removed = repo.fetchById('test-id-1')

    expect(removed.isPresent()).toBeFalsy()

    repo.removeByIds('test-id-2', 'test-id-3')

    const removedList = repo.fetchByIds('test-id-2', 'test-id-3')

    expect(removedList).toHaveLength(0)

    repo.removeBySource('code')

    const fileSource = repo.fetchSorted()

    expect(fileSource).toHaveLength(2)
    expect(fileSource[0].id).toEqual('test-id-4')
    expect(fileSource[1].id).toEqual('test-id-5')

    repo.removeAll()

    const leftover = repo.fetchSorted()

    expect(leftover).toHaveLength(0)
  })
})
