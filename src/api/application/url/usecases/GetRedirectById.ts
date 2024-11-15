import { inject, injectable } from "tsyringe";
import { Repository } from "../../../adapters/repositories/ports/Repository";
import { Url } from "../domain/Url";
import { RedisClientType } from "redis";
import { GetRedirectByIdPort } from "../ports/UrlPorts";
import { CONFIG } from "../../../shared/config/Config";

@injectable()
export class GetRedirectByIdUseCase implements GetRedirectByIdPort{

    constructor(
        @inject("UrlRepository")
        private urlRepository: Repository<Url>,
        @inject("RedisClient")
        private redis: RedisClientType
    ) {}

    public async *execute(id: string) {
        try {
            const foundRedirectInCache = await this.redis.GET(id)
            if (foundRedirectInCache) {
                yield foundRedirectInCache

                await this.urlRepository.executeRaw(
                    `UPDATE urls_uses_count SET "usesCount" = "usesCount" + 1 WHERE id = '${id}';`
                )
                // reseting expiration time if redirect is found
                this.redis.SETEX(id, CONFIG.redisExpiration, foundRedirectInCache)
                yield
            }

            const foundRedirectInDatabase = await this.urlRepository.get(id)
            if (foundRedirectInDatabase) {
                yield foundRedirectInDatabase.to

                await this.urlRepository.executeRaw(
                    `UPDATE urls_uses_count SET "usesCount" = "usesCount" + 1 WHERE id = '${id}';`
                )
                // writing redirect in cache if it doesnt exist there
                this.redis.SET(id, foundRedirectInDatabase.to, { EX: CONFIG.redisExpiration })
                yield
            }

            return {
                code: 404,
                message: "Can not find redirect url"
            }

        // can't use exception catch decorator in generator method, so i made basic catch statement
        } catch (error) {
            return {
                code: 503,
                message: "Service unavailable"
            }
        }
    }
}