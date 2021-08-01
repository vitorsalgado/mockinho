export function fakeMatcherContext(): any {
  return {
    context: fakeContext()
  }
}

export function fakeContext(): any {
  return {
    provideConfigurations() {
      return {
        fixturesPath: '',
        fixturesBodyPath: ''
      }
    }
  }
}
