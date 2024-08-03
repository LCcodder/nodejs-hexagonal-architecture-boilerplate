export declare interface IConfig {
    log: () => void

    appPort: number

    jwtSecret: string
    jwtExpiration: string
    redisExpiration: number
    redisConnectionString?: string

    databaseHost: string
    datacenter: string
    keyspace: string
    databaseUsername?: string
    databasePassword?: string
}