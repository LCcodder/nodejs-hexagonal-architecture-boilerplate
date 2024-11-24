import { inject, injectable } from "tsyringe";
import { Repository } from "../../../adapters/repositories/ports/Repository";
import { Url, UrlToGetOne } from "../domain/Url";
import { GetUrlByIdPort } from "../ports/UrlPorts";
import { withExceptionCatch } from "../../../shared/decorators/WithExceptionCatch";
import { URL_NOT_FOUND } from "../../../shared/errors/UrlErrors";

@injectable()
export class GetUrlByIdUseCase implements GetUrlByIdPort{

    constructor(
        @inject("UrlRepository")
        private urlRepository: Repository<Url>
    ) {}

    @withExceptionCatch
    public async execute(id: string) {
        const foundUrl = await this.urlRepository.get(id) as UrlToGetOne
        if (!foundUrl) {
            return URL_NOT_FOUND
        }

        return foundUrl
    }
}