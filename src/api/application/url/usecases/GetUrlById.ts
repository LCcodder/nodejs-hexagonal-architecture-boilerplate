import { inject, injectable } from "tsyringe";
import { Repository } from "../../../adapters/repositories/ports/Repository";
import { Url, UrlToGetOne } from "../domain/Url";
import { RedisClientType } from "redis";
import { GetUrlByIdPort } from "../ports/UrlPorts";

@injectable()
export class GetUrlByIdUseCase implements GetUrlByIdPort{

    constructor(
        @inject("UrlRepository")
        private urlRepository: Repository<Url>
    ) {}

    public async execute(id: string) {
        try {
            const foundUrl = await this.urlRepository.get(id) as UrlToGetOne
            if (!foundUrl) {
                return {
                    code: 404,
                    message: "Url can not be found"
                }
            }

            return foundUrl
        } catch (error) {
            return {
                code: 503,
                message: "Service unavailable"
            }
        }
    }
}