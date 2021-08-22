import { scenarioMatcher } from '../scenarioMatcher'

describe.skip('scenarioMatcher', function () {
  it('should return false when scenario state differs from mock required state', function () {
    const name = 'the name'
    const newState = 'the new state'

    expect(scenarioMatcher(name, 'started', newState)())
    expect(scenarioMatcher(name, newState)()).toBeTruthy()
    expect(scenarioMatcher(name, 'random-state')()).toBeFalsy()
  })

  it('should return true when state is not registered', function () {
    expect(scenarioMatcher('none', 'nothing')()).toBeTruthy()
  })
})
