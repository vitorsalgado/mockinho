import { Matcher } from './Matcher'

export type StubSource = 'code' | 'file'

export interface Expectation<Value, ValueContext> {
  valueGetter: (ctx: ValueContext) => Value
  matcher: Matcher<Value>
  weight: number
}

export interface ResponseDefinitionBuilderContext {
  fixturesPath: string
  fixturesBodyPath: string
}

export interface ResponseDefinitionBuilder<ResponseDefinition> {
  build(context: ResponseDefinitionBuilderContext): ResponseDefinition
}
