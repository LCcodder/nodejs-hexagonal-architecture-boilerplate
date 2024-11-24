import {_Error} from "../types/_Error";

export const SERVICE_UNAVAILABLE: _Error = {
    code: 503,
    message: "Service unavailable"
} as const

export const INTERNAL_SERVER_ERROR: _Error = {
    code: 500,
    message: "Internal server error"
} as const
