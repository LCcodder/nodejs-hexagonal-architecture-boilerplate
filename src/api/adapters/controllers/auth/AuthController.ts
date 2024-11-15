import { inject, injectable } from "tsyringe";
import { AuthorizePort } from "../../../application/auth/ports/AuthPorts";
import {Request, Response} from "express"
import { isError } from "../../../shared/types/guards/IsError";
import { UserCredentials } from "../../../application/user/domain/User";
import { InternalServerError } from "../common/InternalServerErrorForResponse";


@injectable()
export default class AuthController {
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
            return InternalServerError(res)
        }
    }
}

// AuthController.prefix