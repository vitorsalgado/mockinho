import { MockBuilder } from '../MockBuilder'
import { Mock } from '../Mock'

describe('MockBuilder', function () {
  class TestBuilder extends MockBuilder<Mock> {
    props(): {
      id: string
      name: string
      priority: number
    } {
      return {
        id: this._id,
        name: this._name,
        priority: this._priority,
      }
    }

    build(): Mock {
      return undefined as unknown as Mock
    }
  }

  it('should set properties', function () {
    const builder = new TestBuilder()

    builder
      .id('test-id')
      .name('test-name')
      .priority(1)
      .scenario('scenario-name', 'scenario-required-state', 'scenario-new-state')
      .newScenario('test', 'new-test-state')

    const props = builder.props()

    expect(props.id).toEqual('test-id')
    expect(props.name).toEqual('test-name')
    expect(props.priority).toEqual(1)
  })
})
