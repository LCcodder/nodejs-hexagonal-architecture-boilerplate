import { Repository } from "../../../adapters/repositories/ports/Repository";
import { User, UserToCreate } from "../domain/User";
import { excludeProperties } from "typing-assets";
import { CreateUserPort } from "../ports/UserPorts";
import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { withExceptionCatch } from "../../decorators/WithExceptionCatch";

@injectable()
export class CreateUserUseCase implements CreateUserPort {
    constructor(
        @inject("UserRepository") private userRepository: Repository<User>
    ) {}

    @withExceptionCatch
    public async execute (user: UserToCreate) {
        const foundUser = await this.userRepository.get(user.email)
        if (foundUser) {
            return {
                code: 400,
                message: "User with that email already exists"
            }
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
