import { Repository } from "../../../adapters/repositories/ports/Repository";
import { User, UserToCreate } from "../domain/User";
import { excludeProperties } from "typing-assets";
import { CreateUserPort } from "../ports/UserPorts";
import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { withExceptionCatch } from "../../../shared/decorators/WithExceptionCatch";
import { USER_ALREADY_EXISTS } from "../../../shared/errors/UserErrors";

@injectable()
export class CreateUserUseCase implements CreateUserPort {
    constructor(
        @inject("UserRepository") private userRepository: Repository<User>
    ) {}

    @withExceptionCatch
    public async execute (user: UserToCreate) {
        const foundUser = await this.userRepository.get(user.email)
        if (foundUser) {
            return USER_ALREADY_EXISTS
        }
    
        const insertData = {
            ...user,
            createdAt: new Date().toISOString(),
        }
        insertData.password = await bcrypt.hash(insertData.password, 10)

        await this.userRepository.insert(insertData)
    
        return excludeProperties(
            insertData,
            "password"
        )
    }
}
