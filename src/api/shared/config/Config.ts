import { logger } from "../../infrastructure/web/logger/PinoLogger";
import { IConfig } from "./IConfig";
import appCfg from "../../../../app-cfg.json"

export const CONFIG: IConfig = {
    appPort: appCfg.app_port || 8080,
    
    jwtSecret: process.env.JWT_SECRET || "secret",
    jwtExpiration: appCfg.jwt_expiration || "24h",

    databaseHost: process.env.DATABASE_HOST || "localhost",
    datacenter: process.env.DATACENTER || "datacenter1",
    keyspace: process.env.KEYSPACE || "miniurl",
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseUsername: process.env.DATABASE_USERNAME,
    redisExpiration: appCfg.redis_expiration || 172800,
    redisConnectionString: process.env.REDIS_CONNECTION_STRING,

    launchDelay: 0,

    log(): void {
        logger.info(`Web app loading with config:\nPORT: ${this.appPort}\nJWT SECRET: ${this.jwtSecret}\nJWT EXPIRATION: ${this.jwtExpiration}\nDATABASE HOST: ${this.databaseHost}\nDATACENTER: ${this.datacenter}\nKEYSPACE: ${this.keyspace}\nREDIS EXPIRATION TIME: ${this.redisExpiration}\nREDIS CONNECTION: ${this.redisConnectionString}\n`)
    },
}