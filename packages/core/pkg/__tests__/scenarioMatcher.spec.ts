import { Scenario } from '../Scenario'
import { scenarioMatcher } from '../scenarioMatcher'
import { Optional } from '../utils'

describe('scenarioMatcher', function () {
  it('should return false when scenario state differs from stub required state', function () {
    const snr = Scenario.newScenario('name')

    const ctx = {
      context: {
        provideScenarioRepository() {
          return {
            fetchByName: jest.fn().mockReturnValueOnce(Optional.of(snr)),
            save: jest.fn()
          }
        }
      }
    } as any

    const name = 'the name'
    const requiredState = 'the required state'
    const newState = 'the new state'

    const result = scenarioMatcher(name, requiredState, newState)(undefined, ctx)

    expect(result).toBeFalsy()
    expect(ctx.context.provideScenarioRepository().save).not.toHaveBeenCalled()
  })

  it('should return update scenario state when stub specifies to do so', function () {
    const name = 'the name'
    const requiredState = 'the required state'
    const newState = 'the new state'
    const addFn = jest.fn()
    const snr = Scenario.newScenario('name')

    snr.updateState(requiredState)

    const ctx = {
      context: {
        provideScenarioRepository() {
          return {
            fetchByName: jest.fn().mockReturnValueOnce(Optional.of(snr)),
            save: addFn
          }
        }
      }
    } as any

    const result = scenarioMatcher(name, requiredState, newState)(undefined, ctx)

    expect(result).toBeTruthy()
    expect(addFn).toHaveBeenCalled()
    expect(snr.state).toEqual(newState)
  })

  it('should return true without updating state when stub does not provide a new state', function () {
    const name = 'the name'
    const requiredState = 'the required state'
    const newState = ''
    const addFn = jest.fn()
    const snr = Scenario.newScenario('name')

    snr.updateState(requiredState)

    const ctx = {
      context: {
        provideScenarioRepository() {
          return {
            fetchByName: jest.fn().mockReturnValueOnce(Optional.of(snr)),
            save: addFn
          }
        }
      }
    } as any

    const result = scenarioMatcher(name, requiredState, newState)(undefined, ctx)

    expect(result).toBeTruthy()
    expect(addFn).not.toHaveBeenCalled()
    expect(snr.state).toEqual(requiredState)
  })
})
