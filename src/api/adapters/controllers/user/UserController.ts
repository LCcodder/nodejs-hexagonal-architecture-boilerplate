import {Request, Response} from "express"
import { User, UserToCreate } from "../../../application/user/domain/User"
import { CreateUserPort, GetUserByEmailPort } from "../../../application/user/ports/UserPorts"
import { _Error } from "../../../types/_Error"
import { inject, injectable } from "tsyringe"
import { excludeProperties } from "typing-assets"
import { isError } from "../../../types/guards/IsError"
import { extractJwtPayload } from "../../../application/auth/jwt/JwtPayloadExtractor"
import { extractToken } from "../../../utils/TokenExtractor"

@injectable()
export default class UserController {
    private static readonly prefix_ = "users"

    static get prefix(): string {
        return `/${UserController.prefix_}/`
    }

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

        } catch (error) {
            return res.status(500).json(
                { code: 500, message: "Internal server error" }
            )
        }
    }

    public getProfile = async (req: Request, res: Response) => {
        try {
            const payload = extractJwtPayload(
                extractToken(req) as string
            ) as { email: string }

            const foundProfile = await this.getUserByEmail.execute(payload.email)
            if (isError(foundProfile)) {
                return res.status(foundProfile.code).json(foundProfile)
            }

            excludeProperties(foundProfile, "password")

            return res.status(200).json(foundProfile)

        } catch (error) {
            return res.status(500).json(
                { code: 500, message: "Internal server error" }
            )
        }
    }
}