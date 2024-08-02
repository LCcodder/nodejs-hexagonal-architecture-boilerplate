import { inject, injectable } from "tsyringe";
import { AuthorizePort } from "../../../application/auth/ports/AuthPorts";
import {Request, Response} from "express"
import { isError } from "../../../types/guards/IsError";
import { UserCredentials } from "../../../application/user/domain/User";


@injectable()
export default class AuthController {
    private static readonly prefix_ = "auth"

    static get prefix(): string {
        return `/${AuthController.prefix_}/`
    }

    constructor(
        @inject("AuthorizeUseCase")
        private authorize: AuthorizePort
    ) {}

    public authorizeUser = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body as UserCredentials

            const generatedToken = await this.authorize.execute(email, password)
            if (isError(generatedToken)) {
                return res.status(generatedToken.code).json(generatedToken)
            }

            return res.status(200).json(generatedToken)
        } catch (error) {
            return res.status(500).json(
                { code: 500, message: "Internal server error" }
            )
        }
    }
}