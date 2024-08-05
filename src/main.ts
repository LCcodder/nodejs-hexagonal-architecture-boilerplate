import start from "./api/Start"
import { InitCfg } from "./api/types/InitCfg"
const initCfg: InitCfg = require("../init-cfg.json")


const express = require("express")
const app = express()

if (initCfg.on_launch_cooldown_ms > 0) {
    setTimeout(() => start(app), initCfg.on_launch_cooldown_ms)
} else {
    start(app)
}
