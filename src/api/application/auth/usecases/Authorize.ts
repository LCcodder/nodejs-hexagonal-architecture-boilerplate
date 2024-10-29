import { inject, injectable } from "tsyringe";
import { GetUserByEmailPort } from "../../user/ports/UserPorts";
import { isError } from "../../../types/guards/IsError";
import bcrypt from "bcrypt"
import { generateToken } from "../jwt/TokenGenerator";
import { CONFIG } from "../../../config/Config";
import { AuthorizePort } from "../ports/AuthPorts";
import { withExceptionCatch } from "../../decorators/WithExceptionCatch";

@injectable()
export class AuthorizeUseCase implements AuthorizePort {
    constructor(
        @inject("GetUserByEmailUseCase")
        private getUserByEmail: GetUserByEmailPort
    ) {}

    @withExceptionCatch
    public async execute(email: string, password: string) {
        
        const foundUser = await this.getUserByEmail.execute(email)
        if (isError(foundUser)) {
            return {
                code: 400,
                message: "Wrong credentials"
            }
        }
        
        const passwordIsValid = await bcrypt.compare(password, foundUser.password)
        if (!passwordIsValid) {
            return {
                code: 400,
                message: "Wrong credentials"
            }
        }
        const token = generateToken(email)

        return {
            token,
            expiresIn: CONFIG.jwtExpiration
        }
    }
}