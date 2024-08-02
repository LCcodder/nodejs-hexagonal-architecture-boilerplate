import { Application } from "express";
import { injectDependencies } from "./DIContainer"
import { routeAuthEndpoints } from "./infrastructure/core/routers/auth/AuthRouter"
import { routeUserEndpoints } from "./infrastructure/core/routers/user/UserRouter"
import { CassandraInstance } from "./infrastructure/database/CassandraInstance"
import { CONFIG } from "./config/Config";
import { httpLogger } from "./utils/PinoLogger";
import { routeUrlEndpoints } from "./infrastructure/core/routers/url/UrlRouter";
const express = require("express")

export default async function start (app: Application): Promise<void> {
    CONFIG.log()

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
    // app.use(httpLogger)

    const coreDependencies = await injectDependencies()

    routeUserEndpoints(app, coreDependencies.userController)
    routeAuthEndpoints(app, coreDependencies.authController)
    routeUrlEndpoints(app, coreDependencies.urlController)
    app.listen(CONFIG.appPort, "localhost", () => {
        console.log(`[Info] Listening incoming trafic at 0.0.0.0:${CONFIG.appPort}\n`)
    })
}