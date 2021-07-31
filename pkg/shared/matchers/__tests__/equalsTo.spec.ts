import { equalsTo } from '../equalsTo'
import { fakeMatcherContext } from './testUtils'

describe('EqualsTo', function () {
  describe('String', function () {
    it('should return true when values are equal', function () {
      const one = 'test'
      const other = 'test'

      expect(equalsTo(one)(other, fakeMatcherContext())).toBeTruthy()
    })

    it('should consider special characters', function () {
      const one = 'tést@--js-pão-de-queijo#___paçoca-com-tapioca'
      const other = 'tést@--js-pão-de-queijo#___paçoca-com-tapioca'
      const otherWithErr = 'test@--js-pão-de-queijo#___paçoca-com-tapioca'

      expect(equalsTo(one)(other, fakeMatcherContext())).toBeTruthy()
      expect(equalsTo(one)(otherWithErr, fakeMatcherContext())).toBeFalsy()
    })

    it('should not ignore case by default', function () {
      const one1 = 'Test'
      const other1 = 'tesT'
      const one2 = 'Test'
      const other2 = 'Test'

      expect(equalsTo(one1)(other1, fakeMatcherContext())).toBeFalsy()
      expect(equalsTo(one2)(other2, fakeMatcherContext())).toBeTruthy()
    })

    it('should ignore case when specified to do so', function () {
      const one = 'Super-TEST'
      const other = 'supER-tEst'

      expect(equalsTo(one, true)(other, fakeMatcherContext())).toBeTruthy()
    })

    it('should compare in different locales', function () {
      const one = '龙'
      const other = '龙'

      expect(equalsTo(one, true)(other, fakeMatcherContext())).toBeTruthy()
    })
  })

  describe('Numbers', function () {
    it('should compare numbers', function () {
      const val = 10

      expect(equalsTo(val)(10, fakeMatcherContext())).toBeTruthy()
      expect(equalsTo(val)(1000, fakeMatcherContext())).toBeFalsy()
    })
  })

  describe('Objects', function () {
    it('should compare objects considering all keys and value types', function () {
      const obj = {
        name: 'test',
        age: 1000,
        active: true,
        list: [
          { job: 'None', title: 'Something' },
          { Job: 'Developer', title: 'Nice Developer', date: '2020-05-05' }
        ],
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world'
            }
          }
        }
      }

      const other = {
        name: 'test',
        age: 1000,
        active: true,
        list: [
          { job: 'None', title: 'Something' },
          { Job: 'Developer', title: 'Nice Developer', date: '2020-05-05' }
        ],
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world'
            }
          }
        }
      }

      const invalidTypes = {
        name: 'test',
        age: '1000',
        active: true,
        list: [
          { job: 'None', title: 'Something' },
          { Job: 'Developer', title: 'Nice Developer', date: '2020-05-05' }
        ],
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world'
            }
          }
        }
      }

      const missingFields = {
        name: 'test',
        age: 1000,
        active: true,
        list: [{ Job: 'Developer', title: 'Nice Developer', date: '2020-05-05' }],
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world'
            }
          }
        }
      }

      const unordered = {
        age: 1000,
        name: 'test',
        active: true,
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world'
            }
          }
        },
        list: [
          { job: 'None', title: 'Something' },
          { Job: 'Developer', title: 'Nice Developer', date: '2020-05-05' }
        ]
      }

      expect(equalsTo(obj)(other, fakeMatcherContext())).toBeTruthy()
      expect(equalsTo(obj)(invalidTypes as any, fakeMatcherContext())).toBeFalsy()
      expect(equalsTo(obj)(missingFields as any, fakeMatcherContext())).toBeFalsy()
      expect(equalsTo(obj)(unordered as any, fakeMatcherContext())).toBeTruthy()
    })

    it('should consider array items order but not the items properties ordering', function () {
      const obj = {
        list: [
          { job: 'None', title: 'Something' },
          { Job: 'Developer', title: 'Nice Developer', date: '2020-05-05' }
        ]
      }

      const ordered = {
        list: [
          { title: 'Something', job: 'None' },
          { Job: 'Developer', date: '2020-05-05', title: 'Nice Developer' }
        ]
      }

      const unordered = {
        list: [
          { Job: 'Developer', title: 'Nice Developer', date: '2020-05-05' },
          { job: 'None', title: 'Something' }
        ]
      }

      expect(equalsTo(obj)(ordered, fakeMatcherContext())).toBeTruthy()
      expect(equalsTo(obj)(unordered, fakeMatcherContext())).toBeFalsy()
    })
  })
})
