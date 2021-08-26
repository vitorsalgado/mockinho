import { LoggerPino } from '../LoggerPino'
import { LoggerUtil } from '../LoggerUtil'

describe('Pino Logger', function () {
  it('should call subscribed pino logger without problems', function () {
    const logger = new LoggerPino()

    LoggerUtil.instance().subscribe(logger)

    LoggerUtil.instance().trace('trace', 'param')
    LoggerUtil.instance().debug('debug')
    LoggerUtil.instance().info('info', 100)
    LoggerUtil.instance().warn('warning', true)
    LoggerUtil.instance().error('error', 'parameter')
    LoggerUtil.instance().fatal('world ended', 'good bye')
    LoggerUtil.instance().unsubscribe('fake 1')
    LoggerUtil.instance().fatal('test', 'test')

    expect(logger.name()).toBeDefined()
  })
})
