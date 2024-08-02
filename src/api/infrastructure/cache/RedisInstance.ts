import { createClient, RedisClientType } from 'redis';

export const connectAndGetRedisInstance = async (connectionString?: string): Promise<RedisClientType> => {
    const client = await createClient({ url: connectionString })
        .on('error', err => console.log('[Fatal] Redis Client Error', err))
        .on('connect', () => console.log(`[Info] Connected to redis at ${connectionString}\n`))
        .connect();

    return client as RedisClientType
}