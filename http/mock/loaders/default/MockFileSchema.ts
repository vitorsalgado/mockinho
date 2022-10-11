export default {
  description: 'MockDog Mock File Representation',
  anyOf: [{ $ref: '#/definitions/mock' }, { type: 'array', items: { $ref: '#/definitions/mock' } }],

  definitions: {
    mock: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        priority: { type: 'number' },
        name: { type: 'string' },
        locale: { anyOf: [{ type: 'string' }, { type: 'array' }] },

        scenario: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            requiredState: { type: 'string' },
            newState: { type: 'string' },
          },
          required: ['name'],
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
            urlExact: { type: 'string' },
            querystring: {
              anyOf: [
                { type: 'string' },
                {
                  type: 'object',
                  patternProperties: {
                    '.': {
                      anyOf: [{ type: 'string' }, { type: 'object' }, { type: 'array' }],
                    },
                  },
                },
              ],
            },
            headers: {
              type: 'object',
              patternProperties: {
                '.': {
                  anyOf: [{ type: 'string' }, { type: 'object' }, { type: 'array' }],
                },
              },
            },
            body: {
              anyOf: [
                { type: 'string' },
                {
                  type: 'object',
                  patternProperties: {
                    '.': {
                      anyOf: [{ type: 'string' }, { type: 'object' }, { type: 'array' }],
                    },
                  },
                },
              ],
            },
          },
          required: [],
        },

        response: {
          anyOf: [
            { $ref: '#/definitions/response' },
            { type: 'array', items: { $ref: '#/definitions/response' } },
          ],
        },

        sequence: {
          type: 'object',
          properties: {
            restartAfterEnded: { type: 'boolean' },
            afterEnded: { type: 'object', $ref: '#/definitions/response' },
            responses: { type: 'array', items: { $ref: '#/definitions/response' } },
          },
          required: ['responses'],
        },

        random: {
          type: 'object',
          properties: {
            responses: { type: 'array', items: { $ref: '#/definitions/response' } },
          },
          required: ['responses'],
        },
      },

      required: ['request'],
      additionalProperties: true,
    },

    response: {
      type: 'object',
      properties: {
        status: { type: 'number' },
        body: {
          anyOf: [{ type: 'string' }, { type: 'object' }, { type: 'array' }],
        },
        bodyFile: { type: 'string' },
        bodyTemplate: {
          anyOf: [{ type: 'string' }, { type: 'object' }, { type: 'array' }],
        },
        bodyTemplateFile: { type: 'string' },
        modelFile: { type: 'string' },
        headers: { type: 'object' },
        headerTemplates: {
          type: 'object',
          patternProperties: {
            '.*': { type: 'string' },
          },
        },
        helpers: { type: 'string' },
        delay: { type: 'number' },
      },
      required: ['status'],
    },
  },
}
