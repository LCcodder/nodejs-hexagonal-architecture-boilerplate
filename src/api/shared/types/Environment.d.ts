declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_PORT?: string;
            
            REDIS_CONNECTION_STRING?: string

            JWT_EXPIRATION?: string;
            JWT_SECRET?: string;

            DATABASE_HOST?: string
            DATACENTER?: string
            KEYSPACE?: string
            DATABASE_USERNAME?: string
            DATABASE_PASSWORD?: string

            REDIS_EXPIRATION?: string
        }
    }
}

export {}