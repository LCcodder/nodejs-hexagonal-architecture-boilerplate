import start from "./api/Start"

const express = require("express")
const app = express()

setTimeout(() => start(app), 20000)