import { inject, injectable } from "tsyringe";
import { CreateUrlPort, GetRedirectByIdPort, GetUrlByIdPort, GetUrlsByOwnerEmailPort } from "../../../application/url/ports/UrlPorts";
import { Request, Response } from "express"
import { UrlToCreate } from "../../../application/url/domain/Url";
import { extractJwtPayload } from "../../../application/auth/jwt/JwtPayloadExtractor";
import { extractToken } from "../../../shared/utils/TokenExtractor";
import { isError } from "../../../shared/types/guards/IsError";
import { InternalServerError } from "../../../shared/utils/InternalServerErrorForResponse";

@injectable()
export default class UrlController {
    private static addProtocolToUrl(url: string) {
        const protocol = url.slice(0, 4) 
        if (protocol !== "http") {
            return `http://${url}`
        }
        return url
    }

    constructor(
        @inject("CreateUrlUseCase")
        private createUrl: CreateUrlPort,

        @inject("GetRedirectByIdUseCase")
        private getRedirectById: GetRedirectByIdPort,
        
        @inject("GetUrlByIdUseCase")
        private getUrlById: GetUrlByIdPort,

        @inject("GetUrlsByOwnerEmailUseCase")
        private getUrlsByOwnerEmail: GetUrlsByOwnerEmailPort
    ) {}

    public registerUrl = async (req: Request, res: Response) => {
        try {
            const urlData = req.body as Pick<UrlToCreate, "to">
            const { email } = extractJwtPayload(
                extractToken(req) as string
            ) as { email:string }

            
            urlData.to = UrlController.addProtocolToUrl(urlData.to)

            const createdUrl = await this.createUrl.execute(
                { ...urlData, ownerEmail: email }
            )
            if (isError(createdUrl)) {
                return res.status(createdUrl.code).json(createdUrl)
            }

            return res.status(201).json(createdUrl)
        } catch {
            return InternalServerError(res)
        }
    }

    public redirect = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string
            
            const redirectionUrlIterator = this.getRedirectById.execute(id)
            
            const redirectionUrl = (await redirectionUrlIterator.next()).value
            if (isError(redirectionUrl)) {
                return res.status(redirectionUrl.code).json(redirectionUrl)
            }

            res.status(302).redirect(redirectionUrl)
            await redirectionUrlIterator.next()
        } catch {
            return InternalServerError(res)     
        }
    }

    public getUrl = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string

            const url = await this.getUrlById.execute(id)
            if (isError(url)) {
                return res.status(url.code).json(url)
            }

            return res.status(200).json(url)
        } catch {
            return InternalServerError(res)
        }
    }

    public getCreatedUrls = async (req: Request, res: Response) => {
        try {
            const { email } = extractJwtPayload(
                extractToken(req) as string
            ) as { email: string }

            const urls = await this.getUrlsByOwnerEmail.execute(email)
            if (isError(urls)) {
                return res.status(urls.code).json(urls)
            }

            return res.status(200).json(urls)

        } catch {
            return InternalServerError(res)
        }
    }
}