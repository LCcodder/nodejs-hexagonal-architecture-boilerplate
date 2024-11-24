import { Application } from "express";
import { injectDependencies } from "./DIContainer"
import { routeAuthEndpoints } from "./infrastructure/web/routers/auth/AuthRouter"
import { routeUserEndpoints } from "./infrastructure/web/routers/user/UserRouter"
import { CassandraInstance } from "./infrastructure/storage/database/CassandraInstance"
import { CONFIG } from "./shared/config/Config";
import { httpLogger, logger } from "./infrastructure/web/logger/PinoLogger";
import { routeUrlEndpoints } from "./infrastructure/web/routers/url/UrlRouter";
import { connectAndGetRedisInstance } from "./infrastructure/storage/cache/RedisInstance";
import { connectAndInitKeyspace } from "./infrastructure/storage/database/InitKeyspace";
const express = require("express")

export default async function start (app: Application): Promise<void> {
    CONFIG.log()

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
    app.use(httpLogger)

    const cassandraClient = new CassandraInstance(
        CONFIG.databaseHost,
        CONFIG.datacenter,
        CONFIG.keyspace
    ).client
    await connectAndInitKeyspace(cassandraClient)
    
    const redisClient = await connectAndGetRedisInstance(CONFIG.redisConnectionString)

    const coreDependencies = await injectDependencies(cassandraClient, redisClient)

    routeUserEndpoints(app, coreDependencies.userController)
    routeAuthEndpoints(app, coreDependencies.authController)
    routeUrlEndpoints(app, coreDependencies.urlController)
    
    app.listen(CONFIG.appPort, "0.0.0.0", () => {
        logger.info(`Listening incoming trafic at 0.0.0.0:${CONFIG.appPort}\n`)
    })
}