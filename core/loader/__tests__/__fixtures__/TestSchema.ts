export default {
  description: 'Test Schema',
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

        responseType: { type: 'string' },

        returnErrorOnNoResponse: { type: 'boolean' },
      },
      required: ['request', 'response'],
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
        latency: { type: 'number' },
      },
      required: ['status'],
    },
  },
}
