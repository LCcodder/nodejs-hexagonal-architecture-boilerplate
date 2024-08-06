import pinoHttp from 'pino-http'
import pino from 'pino'

export const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',

        options: {
            colorize: true,
            ignore: 'pid,hostname',
            timestampKey: 'time',
            levelFirst: true,
            messageFormat: true,
            customColors: 'err:red,info:blue',
        }
    }
});
export const httpLogger = pinoHttp({
    logger: logger,
    formatters: {
        level(label, _number) {
            return { level: label }
        },
    }
});