import prettyformat from 'pretty-format'

describe('test', function () {
  test('', function () {
    console.log(prettyformat({ message: 'hi' }, { min: true }))
  })
})
