import { excludeProperties } from "typing-assets";
import { Repository } from "../../../adapters/repositories/ports/Repository";
import { User } from "../domain/User";
import { GetUserByEmailPort } from "../ports/UserPorts";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserByEmailUseCase implements GetUserByEmailPort {
    constructor(
        @inject("UserRepository") private userRepository: Repository<User>
    ) {}

    public async execute (email: string) {
        try {
            const foundUser = await this.userRepository.get(email) as User
            if (!foundUser) {
                return {
                    code: 404,
                    message: "User with that email not found"
                }
            }
    
            return foundUser
            
        } catch (error) {
            return {
                code: 503,
                message: "Service unavailable"
            }
        }
    }
}
