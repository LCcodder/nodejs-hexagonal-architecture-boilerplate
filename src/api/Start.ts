import { Application } from "express";
import { injectDependencies } from "./DIContainer"
import { routeAuthEndpoints } from "./infrastructure/core/routers/auth/AuthRouter"
import { routeUserEndpoints } from "./infrastructure/core/routers/user/UserRouter"
import { CassandraInstance } from "./infrastructure/database/CassandraInstance"
import { CONFIG } from "./config/Config";
import { httpLogger } from "./utils/PinoLogger";
import { routeUrlEndpoints } from "./infrastructure/core/routers/url/UrlRouter";
import { connectAndGetRedisInstance } from "./infrastructure/cache/RedisInstance";
import { connectAndInitKeyspace } from "./infrastructure/database/InitKeyspace";
const express = require("express")

export default async function start (app: Application): Promise<void> {
    CONFIG.log()

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
    // app.use(httpLogger)

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
        console.log(`[Info] Listening incoming trafic at 0.0.0.0:${CONFIG.appPort}\n`)
    })
}