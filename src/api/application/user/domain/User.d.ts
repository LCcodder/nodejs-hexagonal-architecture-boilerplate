export declare type User = {
    email: string
    password: string
    username: string
    createdAt: string
}
export declare type UserToCreate = Omit<User, "createdAt">
export declare type UserToGet = Omit<User, "password">
export declare type UserCredentials = Pick<User, "password" | "email">