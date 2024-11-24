import { Repository } from "../../../adapters/repositories/ports/Repository";
import { User } from "../domain/User";
import { GetUserByEmailPort } from "../ports/UserPorts";
import { inject, injectable } from "tsyringe";
import { withExceptionCatch } from "../../../shared/decorators/WithExceptionCatch";
import { USER_NOT_FOUND } from "../../../shared/errors/UserErrors";

@injectable()
export class GetUserByEmailUseCase implements GetUserByEmailPort {
    constructor(
        @inject("UserRepository") private userRepository: Repository<User>
    ) {}

    @withExceptionCatch
    public async execute (email: string) {
        const foundUser = await this.userRepository.get(email) as User
        if (!foundUser) {
            return USER_NOT_FOUND
        }
    
        return foundUser
    }
}
