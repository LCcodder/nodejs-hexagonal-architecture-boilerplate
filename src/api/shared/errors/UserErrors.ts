import { _Error } from "../types/_Error";

export const USER_ALREADY_EXISTS: _Error = {
    code: 400,
    message: "User with that email already exists"
} as const

export const USER_NOT_FOUND: _Error = {
    code: 404,
    message: "User with that email not found"
}