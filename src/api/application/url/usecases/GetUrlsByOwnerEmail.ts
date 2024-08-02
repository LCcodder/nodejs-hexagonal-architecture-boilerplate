import { inject, injectable } from "tsyringe";
import { Repository } from "../../../adapters/repositories/ports/Repository";
import { Url } from "../domain/Url";
import { GetUrlsByOwnerEmailPort } from "../ports/UrlPorts";

@injectable()
export class GetUrlsByOwnerEmailUseCase implements GetUrlsByOwnerEmailPort {
    constructor(
        @inject("UrlRepository")
        private urlRepository: Repository<Url>
    ) {}

    public async execute(email: string) {
        try {
            const foundUrls = await this.urlRepository.getAll(email)
            return foundUrls
        } catch (error) {
            console.log(error)
            return {
                code: 503,
                message: "Service unavailable"
            }
        }
    }
}