import { _Error } from "../../../types/_Error";

export declare interface AuthorizePort {
    execute(email: string, password: string): Promise<
    | _Error
    | { token: string, expiresIn: string }   
    >
}