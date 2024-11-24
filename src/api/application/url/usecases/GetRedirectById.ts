import { inject, injectable } from "tsyringe";
import { Repository } from "../../../adapters/repositories/ports/Repository";
import { Url } from "../domain/Url";
import { RedisClientType } from "redis";
import { GetRedirectByIdPort } from "../ports/UrlPorts";
import { CONFIG } from "../../../shared/config/Config";
import { URL_NOT_FOUND } from "../../../shared/errors/UrlErrors";
import { SERVICE_UNAVAILABLE } from "../../../shared/errors/CommonErrors";

@injectable()
export class GetRedirectByIdUseCase implements GetRedirectByIdPort{

    constructor(
        @inject("UrlRepository")
        private urlRepository: Repository<Url>,
        @inject("RedisClient")
        private redis: RedisClientType
    ) {}

    private async increaseUsesCount(id: string): Promise<void> {
        await this.urlRepository.executeRaw(
            `UPDATE urls_uses_count SET "usesCount" = "usesCount" + 1 WHERE id = '${id}';`
        )
    }

    public async *execute(id: string) {
        try {
            const foundRedirectInCache = await this.redis.GET(id)
            if (foundRedirectInCache) {
                yield foundRedirectInCache

                await this.increaseUsesCount(id)
                
                // reseting expiration time if redirect is found
                await this.redis.SETEX(id, CONFIG.redisExpiration, foundRedirectInCache)
                yield
            }

            const foundRedirectInDatabase = await this.urlRepository.get(id)
            if (foundRedirectInDatabase) {
                yield foundRedirectInDatabase.to

                await this.increaseUsesCount(id)
                
                // writing redirect in cache if it doesnt exist there
                await this.redis.SET(id, foundRedirectInDatabase.to, { EX: CONFIG.redisExpiration })
                yield
            }

            return URL_NOT_FOUND

        // can't use exception catch decorator in generator method, so i made basic catch statement
        } catch {
            return SERVICE_UNAVAILABLE
        }
    }
}