import { compile } from 'handlebars'
import { Helper } from '@mockdog/core'
import { Template } from '@mockdog/core'
import { TemplateParseDelegate } from '@mockdog/core'

export class HandlebarsTemplating<M, H extends Helper = Helper> implements Template<M, H> {
  compile(input: string): TemplateParseDelegate<M, H> {
    return function (model: M, helpers: H) {
      return Promise.resolve(compile(input)(model, { helpers }))
    }
  }
}
