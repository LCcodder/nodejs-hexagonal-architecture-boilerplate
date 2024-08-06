import { IConfig } from "./IConfig";

export const CONFIG: IConfig = {
    appPort: parseInt(process.env.APP_PORT || "8080") ,
    
    jwtSecret: process.env.JWT_SECRET || "secret",
    jwtExpiration: process.env.JWT_EXPIRATION || "24h",

    databaseHost: process.env.DATABASE_HOST || "localhost",
    datacenter: process.env.DATACENTER || "datacenter1",
    keyspace: process.env.KEYSPACE || "miniurl",
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseUsername: process.env.DATABASE_USERNAME,
    redisExpiration: parseInt(process.env.REDIS_EXPIRATION || "172_800"),
    redisConnectionString: process.env.REDIS_CONNECTION_STRING,

    log(): void {
        console.log(`[Info] Web app loading with config:\nPORT: ${this.appPort}\nJWT SECRET: ${this.jwtSecret}\nJWT EXPIRATION: ${this.jwtExpiration}\nDATABASE HOST: ${this.databaseHost}\nDATACENTER: ${this.datacenter}\nKEYSPACE: ${this.keyspace}\nREDIS EXPIRATION TIME: ${this.redisExpiration}\nREDIS CONNECTION: ${this.redisConnectionString}\n`)
    },
}