import { inject, injectable } from "tsyringe";
import { Repository } from "../../../adapters/repositories/ports/Repository";
import { Url } from "../domain/Url";
import { GetUrlsByOwnerEmailPort } from "../ports/UrlPorts";
import { withExceptionCatch } from "../../decorators/WithExceptionCatch";

@injectable()
export class GetUrlsByOwnerEmailUseCase implements GetUrlsByOwnerEmailPort {
    constructor(
        @inject("UrlRepository")
        private urlRepository: Repository<Url>
    ) {}

    @withExceptionCatch
    public async execute(email: string) {
        const foundUrls = await this.urlRepository.getAll(email)
        return foundUrls
    }
}