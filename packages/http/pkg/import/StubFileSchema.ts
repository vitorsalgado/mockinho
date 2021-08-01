export default {
  description: 'Mockinho Stub File Representation',
  anyOf: [{ $ref: '#/definitions/stub' }, { type: 'array', items: { $ref: '#/definitions/stub' } }],

  definitions: {
    stub: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        priority: { type: 'number' },
        name: { type: 'string' },

        scenario: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            requiredState: { type: 'string' },
            newState: { type: 'string' }
          },
          required: []
        },

        request: {
          type: 'object',
          properties: {
            method: { type: 'string' },
            name: { type: 'string' },
            url: { type: 'string' },
            urlPath: { type: 'string' },
            urlPattern: { type: 'string' },
            urlPathPattern: { type: 'string' },
            querystring: {
              anyOf: [
                { type: 'string' },
                {
                  type: 'object',
                  patternProperties: {
                    '.': {
                      anyOf: [{ type: 'string' }, { type: 'object' }, { type: 'array' }]
                    }
                  }
                }
              ]
            },
            headers: {
              type: 'object',
              patternProperties: {
                '.': {
                  anyOf: [{ type: 'string' }, { type: 'object' }, { type: 'array' }]
                }
              }
            },
            body: {
              anyOf: [
                { type: 'string' },
                {
                  type: 'object',
                  patternProperties: {
                    '.': {
                      anyOf: [{ type: 'string' }, { type: 'object' }, { type: 'array' }]
                    }
                  }
                }
              ]
            }
          },
          required: []
        },

        response: {
          type: 'object',
          properties: {
            status: { type: 'number' },
            body: {
              anyOf: [{ type: 'string' }, { type: 'object' }, { type: 'array' }]
            },
            bodyFile: { type: 'string' },
            headers: { type: 'object' }
          },
          required: ['status']
        }
      },
      required: ['request', 'response'],
      additionalProperties: true
    }
  }
}
