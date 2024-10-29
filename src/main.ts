import { CONFIG } from "./api/config/Config"
import start from "./api/Start"
const express = require("express")


const app = express()
if (CONFIG.launchDelay > 0) {
    setTimeout(() => start(app), CONFIG.launchDelay)
} else {
    start(app)
}
