import { stateMatcher, StateRepository } from '../state.js'
import { State } from '../state.js'

describe('Scenario', function () {
  it('should create new scenario with name, id as uuid and scenario equal to started', function () {
    const name = 'the name'
    const scenario = State.newStateMachine(name)

    expect(scenario.name).toEqual(name)
    expect(scenario.id).toBeDefined()
    expect(scenario.currentState()).toEqual(State.STATE_STARTED)
    expect(scenario.isStarted()).toBeTruthy()
  })

  it('should change state', function () {
    const state = 'new scenario value'
    const scenario = State.newStateMachine('name')

    scenario.updateState(state)

    expect(scenario.currentState()).toEqual(state)
    expect(scenario.isStarted()).toBeFalsy()
  })

  it('should create with provided values when using default constructor', function () {
    const id = 'test'
    const name = 'test name'
    const state = 'test state'

    const scenario = new State(id, name, state)

    expect(scenario.id).toEqual(id)
    expect(scenario.name).toEqual(name)
    expect(scenario.currentState()).toEqual(state)
    expect(scenario.isStarted()).toBeFalsy()
  })

  describe('Repository', function () {
    it('should create new scenario when it does not exist', function () {
      const repo = new StateRepository()

      const name = 'test'
      const scenario1 = repo.createNewIfNeeded(name)
      const scenario2 = repo.createNewIfNeeded(name)
      const byName = repo.fetchByName(name)

      expect(scenario1).toEqual(scenario2)
      expect(scenario1).toEqual(byName.get())
      expect(repo.fetchAll()).toHaveLength(1)
    })

    it('should add new scenario when it does not exist', function () {
      const repo = new StateRepository()

      const name = 'test'
      const scenario = State.newStateMachine(name)
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

describe('scenarioStatefulMatcher', function () {
  describe('started state', function () {
    it('should return true when state is started', function () {
      const scenario = stateMatcher(new StateRepository())

      expect(scenario('test')().pass).toBeTruthy()
    })
  })

  it('should return true when state is not found', function () {
    const scenario = stateMatcher(new StateRepository())('added')

    expect(scenario().pass).toBeTruthy()
  })

  it('should added new state', function () {
    const started = stateMatcher(new StateRepository())('add', State.STATE_STARTED, 'added')

    expect(started().pass).toBeTruthy()
  })

  it('should return false when scenario state is not equal to the required state', function () {
    const scenarioRepository = new StateRepository()
    const scenario = State.newStateMachine('test')

    scenario.updateState('dev')
    scenarioRepository.save(scenario)

    const theMatcher = stateMatcher(scenarioRepository)('test', 'qa', 'added')

    expect(theMatcher().pass).toBeFalsy()
  })
})
