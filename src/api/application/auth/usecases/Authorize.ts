import { inject, injectable } from "tsyringe";
import { GetUserByEmailPort } from "../../user/ports/UserPorts";
import { isError } from "../../../shared/types/guards/IsError";
import bcrypt from "bcrypt"
import { generateToken } from "../jwt/TokenGenerator";
import { CONFIG } from "../../../shared/config/Config";
import { AuthorizePort } from "../ports/AuthPorts";
import { withExceptionCatch } from "../../../shared/decorators/WithExceptionCatch";
import { WRONG_USER_CREDENTIALS } from "../../../shared/errors/AuthErrors";

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
            return WRONG_USER_CREDENTIALS
        }
        
        const passwordIsValid = await bcrypt.compare(password, foundUser.password)
        if (!passwordIsValid) {
            return WRONG_USER_CREDENTIALS
        }
        const token = generateToken(email)

        return {
            token,
            expiresIn: CONFIG.jwtExpiration
        }
    }
}