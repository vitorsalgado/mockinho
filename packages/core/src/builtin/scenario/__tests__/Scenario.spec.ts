import { v4, validate } from 'uuid'
import { Scenario, SCENARIO_STATE_STARTED } from '../Scenario'
import { ScenarioInMemoryRepository } from '../ScenarioInMemoryRepository'

describe('Scenario', function () {
  it('should create new scenario with name, id as uuid and state equal to STARTED', function () {
    const name = 'the name'
    const scenario = Scenario.newScenario(name)

    expect(scenario.name).toEqual(name)
    expect(validate(scenario.id)).toBeTruthy()
    expect(scenario.state).toEqual(SCENARIO_STATE_STARTED)
    expect(scenario.isStarted()).toBeTruthy()
  })

  it('should change state', function () {
    const state = 'new state value'
    const scenario = Scenario.newScenario('name')

    scenario.updateState(state)

    expect(scenario.state).toEqual(state)
    expect(scenario.isStarted()).toBeFalsy()
  })

  it('should create with provided values when using default constructor', function () {
    const id = v4()
    const name = 'test name'
    const state = 'test state'

    const scenario = new Scenario(id, name, state)

    expect(scenario.id).toEqual(id)
    expect(scenario.name).toEqual(name)
    expect(scenario.state).toEqual(state)
    expect(scenario.isStarted()).toBeFalsy()
  })

  describe('Repository', function () {
    it('should create new scenario when it does not exist', function () {
      const repo = new ScenarioInMemoryRepository()

      const name = 'test'
      const scenario1 = repo.createNewIfNeeded(name)
      const scenario2 = repo.createNewIfNeeded(name)
      const byName = repo.fetchByName(name)

      expect(scenario1).toEqual(scenario2)
      expect(scenario1).toEqual(byName.get())
      expect(repo.fetchAll()).toHaveLength(1)
    })

    it('should add new scenario when it does not exist', function () {
      const repo = new ScenarioInMemoryRepository()

      const name = 'test'
      const scenario = Scenario.newScenario(name)
      const added = repo.save(scenario)
      const addedAgain = repo.save(scenario)
      const addedOneMoreTime = repo.save(added)

      expect(scenario).toEqual(added)
      expect(added).toEqual(addedAgain)
      expect(addedAgain).toEqual(addedOneMoreTime)
      expect(repo.fetchAll()).toHaveLength(1)
    })
  })
})
