import { compile } from 'handlebars'
import { Templating } from './Templating.js'
import { Helper } from './Helper.js'
import { TemplateParseDelegate } from './TemplateParseDelegate.js'

export class HandlebarsTemplating<M, H extends Helper = Helper> implements Templating<M, H> {
  compile(input: string): TemplateParseDelegate<M, H> {
    return function (model: M, helpers: H) {
      return Promise.resolve(compile(input)(model, { helpers }))
    }
  }
}
