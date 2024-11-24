import {Request, Response} from "express"
import { User, UserToCreate } from "../../../application/user/domain/User"
import { CreateUserPort, GetUserByEmailPort } from "../../../application/user/ports/UserPorts"
import { _Error } from "../../../shared/types/_Error"
import { inject, injectable } from "tsyringe"
import { excludeProperties } from "typing-assets"
import { isError } from "../../../shared/types/guards/IsError"
import { extractJwtPayload } from "../../../application/auth/jwt/JwtPayloadExtractor"
import { extractToken } from "../../../shared/utils/TokenExtractor"
import { InternalServerError } from "../../../shared/utils/InternalServerErrorForResponse"

@injectable()
export default class UserController {
    constructor(
        @inject("CreateUserUseCase")
        private createUser: CreateUserPort,
        
        @inject("GetUserByEmailUseCase")
        private getUserByEmail: GetUserByEmailPort
    ) {}
    
    public registerUser = async (req: Request, res: Response) => {
        try {
            const registrationData = req.body as UserToCreate

            const registeredUser = await this.createUser.execute(registrationData)
            
            if (isError(registeredUser)) {
                return res.status(registeredUser.code).json(registeredUser)
            }

            return res.status(201).json(registeredUser)

        } catch {
            return InternalServerError(res)
        }
    }

    public getProfile = async (req: Request, res: Response) => {
        try {
            const { email } = extractJwtPayload(
                extractToken(req) as string
            ) as { email: string }

            const profile = await this.getUserByEmail.execute(email)
            if (isError(profile)) {
                return res.status(profile.code).json(profile)
            }

            excludeProperties(profile, "password")

            return res.status(200).json(profile)

        } catch {
            return InternalServerError(res)
        }
    }
}