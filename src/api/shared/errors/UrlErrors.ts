import {_Error} from "../types/_Error";

export const URL_NOT_FOUND: _Error = {
    code: 404,
    message: "Can not find redirect url"
} as const

export const TOKEN_NOT_FOUND: _Error = {
    code: 401,
    message: "Auth token not found"
} as const

export const TOKEN_IS_INVALID: _Error = {
    code: 401,
    message: "Auth token is invalid"
} as const
