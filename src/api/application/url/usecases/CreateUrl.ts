import { inject, injectable } from "tsyringe";
import { Repository } from "../../../adapters/repositories/ports/Repository";
import { Url, UrlToCreate } from "../domain/Url";
import { RedisClientType } from "redis";
import { CreateUrlPort } from "../ports/UrlPorts";

@injectable()
export class CreateUrlUseCase implements CreateUrlPort {
    private static generateId(): string {
        const symbols = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
        let id = ""
        for (let i = 0; i < 6; i++) {
            id += symbols[
                Math.floor(Math.random() * ((symbols.length - 1) - 0 + 1) + 0)
            ]
        }
        return id
    }
    
    constructor(
        @inject("UrlRepository")
        private urlRepository: Repository<Url>,
        @inject("RedisClient")
        private redis: RedisClientType
    ) {}

    public async execute(url: UrlToCreate) {
        try {
            const id = CreateUrlUseCase.generateId()
            const insertData = {
                id,
                ...url,
                createdAt: new Date().toISOString(),
            }

            
            await this.urlRepository.insert(insertData)
            await this.redis.SET(id, url.to)                

            return {...insertData, usesCount: 0}
        } catch (error) {
            console.log(error)
            return {
                code: 503,
                message: "Service unavailable"
            }
        }
    }


}