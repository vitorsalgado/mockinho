import { equalTo } from '../equalTo.js'

describe('EqualsTo', function () {
  describe('String', function () {
    it('should return true when values are equal', function () {
      const one = 'test'
      const other = 'test'

      expect(equalTo(one)(other).pass).toBeTruthy()
    })

    it('should consider special characters', function () {
      const one = 'tést@--js-pão-de-queijo#___paçoca-com-tapioca'
      const other = 'tést@--js-pão-de-queijo#___paçoca-com-tapioca'
      const otherWithErr = 'test@--js-pão-de-queijo#___paçoca-com-tapioca'

      expect(equalTo(one)(other).pass).toBeTruthy()
      expect(equalTo(one)(otherWithErr).pass).toBeFalsy()
    })

    it('should not ignore case by default', function () {
      const one1 = 'Test'
      const other1 = 'tesT'
      const one2 = 'Test'
      const other2 = 'Test'

      expect(equalTo(one1)(other1).pass).toBeFalsy()
      expect(equalTo(one2)(other2).pass).toBeTruthy()
    })

    it('should ignore case when specified to do so', function () {
      const one = 'Super-TEST'
      const other = 'supER-tEst'

      expect(equalTo(one, true)(other).pass).toBeTruthy()
    })

    it('should compare in different locales', function () {
      const one = '龙'
      const other = '龙'

      expect(equalTo(one, true)(other).pass).toBeTruthy()
    })
  })

  describe('Numbers', function () {
    it('should compare numbers', function () {
      const val = 10

      expect(equalTo(val)(10).pass).toBeTruthy()
      expect(equalTo(val)(1000).pass).toBeFalsy()
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
          { job: 'Developer', title: 'Nice Developer', date: '2020-05-05' },
        ],
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world',
            },
          },
        },
      }

      const other = {
        name: 'test',
        age: 1000,
        active: true,
        list: [
          { job: 'None', title: 'Something' },
          { job: 'Developer', title: 'Nice Developer', date: '2020-05-05' },
        ],
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world',
            },
          },
        },
      }

      const invalidTypes = {
        name: 'test',
        age: '1000',
        active: true,
        list: [
          { job: 'None', title: 'Something' },
          { job: 'Developer', title: 'Nice Developer', date: '2020-05-05' },
        ],
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world',
            },
          },
        },
      }

      const missingFields = {
        name: 'test',
        age: 1000,
        active: true,
        list: [{ job: 'Developer', title: 'Nice Developer', date: '2020-05-05' }],
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world',
            },
          },
        },
      }

      const unordered = {
        age: 1000,
        name: 'test',
        active: true,
        StrangeKey: {
          sub1: {
            sub2: {
              hello: 'world',
            },
          },
        },
        list: [
          { job: 'None', title: 'Something' },
          { job: 'Developer', title: 'Nice Developer', date: '2020-05-05' },
        ],
      }

      expect(equalTo(obj)(other).pass).toBeTruthy()
      expect(equalTo(obj as unknown)(invalidTypes as unknown).pass).toBeFalsy()
      expect(equalTo(obj as unknown)(missingFields as unknown).pass).toBeFalsy()
      expect(equalTo(obj as unknown)(unordered as unknown).pass).toBeTruthy()
    })

    it('should consider array items order but not the items properties ordering', function () {
      const obj = {
        list: [
          { job: 'None', title: 'Something' },
          { job: 'Developer', title: 'Nice Developer', date: '2020-05-05' },
        ],
      }

      const ordered = {
        list: [
          { title: 'Something', job: 'None' },
          { job: 'Developer', date: '2020-05-05', title: 'Nice Developer' },
        ],
      }

      const unordered = {
        list: [
          { job: 'Developer', title: 'Nice Developer', date: '2020-05-05' },
          { job: 'None', title: 'Something' },
        ],
      }

      expect(equalTo(obj)(ordered).pass).toBeTruthy()
      expect(equalTo(obj)(unordered).pass).toBeFalsy()
    })
  })
})
