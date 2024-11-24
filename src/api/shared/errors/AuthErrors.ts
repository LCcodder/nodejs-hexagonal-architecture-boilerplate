import { _Error } from "../types/_Error";

export const WRONG_USER_CREDENTIALS: _Error = {
    code: 400,
    message: "Wrong credentials"
} as const