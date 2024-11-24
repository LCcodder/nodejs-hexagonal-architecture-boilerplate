import { createClient, RedisClientType } from 'redis';
import { logger } from '../../web/logger/PinoLogger';

export const connectAndGetRedisInstance = async (connectionString?: string): Promise<RedisClientType> => {
    const client = await createClient({ url: connectionString })
        .on('error', err => logger.fatal('Redis Client Error', err))
        .on('connect', () => logger.info(`Connected to redis at ${connectionString}\n`))
        .connect();

    return client as RedisClientType
}