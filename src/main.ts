import { CONFIG } from "./api/shared/config/Config"
import start from "./api/Start"
const express = require("express")


const app = express()
setTimeout(() => start(app), CONFIG.launchDelay)
