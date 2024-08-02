import { inject, injectable } from "tsyringe";
import { Repository } from "../../../adapters/repositories/ports/Repository";
import { Url } from "../domain/Url";
import { RedisClientType } from "redis";
import { GetRedirectByIdPort } from "../ports/UrlPorts";

@injectable()
export class GetRedirectByIdUseCase implements GetRedirectByIdPort{

    constructor(
        @inject("UrlRepository")
        private urlRepository: Repository<Url>,
        @inject("RedisClient")
        private redis: RedisClientType
    ) {}

    public async execute(id: string) {
        try {
            const foundRedirectInCache = await this.redis.GET(id)
            if (foundRedirectInCache) {
                await this.urlRepository.executeRaw(
                    `UPDATE urls_uses_count SET "usesCount" = "usesCount" + 1 WHERE id = '${id}';`
                )
                return foundRedirectInCache
            }

            const foundRedirectInDatabase = await this.urlRepository.get(id)
            if (foundRedirectInDatabase) {
                await this.urlRepository.executeRaw(
                    `UPDATE urls_uses_count SET "usesCount" = "usesCount" + 1 WHERE id = '${id}';`
                )
                return foundRedirectInDatabase.to
            }

            return {
                code: 404,
                message: "Can not find redirect url"
            }

        } catch (error) {
            return {
                code: 503,
                message: "Service unavailable"
            }
        }
    }
}