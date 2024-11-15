import { _Error } from "../../../shared/types/_Error"
import { UserToCreate, UserToGet, User } from "../domain/User"

export declare interface CreateUserPort {
    execute (user: UserToCreate): Promise<
    | _Error
    | UserToGet
    >
} 

export declare interface GetUserByEmailPort {
    execute (email: string): Promise<
    | _Error
    | User
    >
} 