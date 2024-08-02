import { inject, injectable } from "tsyringe";
import { CreateUrlPort, GetRedirectByIdPort, GetUrlByIdPort, GetUrlsByOwnerEmailPort } from "../../../application/url/ports/UrlPorts";
import { Request, Response } from "express"
import { UrlToCreate } from "../../../application/url/domain/Url";
import { extractJwtPayload } from "../../../application/auth/jwt/JwtPayloadExtractor";
import { extractToken } from "../../../utils/TokenExtractor";
import { isError } from "../../../types/guards/IsError";

@injectable()
export default class UrlController {
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
            const payload = extractJwtPayload(
                extractToken(req) as string
            )

            const protocol = urlData.to.slice(0, 4) 
            if (protocol !== "http") {
                urlData.to = `http://${urlData.to}`
            }

            const createdUrl = await this.createUrl.execute(
                { ...urlData, ownerEmail: payload?.email }
            )
            if (isError(createdUrl)) {
                return res.status(createdUrl.code).json(createdUrl)
            }

            return res.status(201).json(createdUrl)
        } catch (error) {
            return res.status(500).json(
                { code: 500, message: "Internal server error" }
            )
        }
    }

    public redirect = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string
            
            const redirectionUrl = await this.getRedirectById.execute(id)
            if (isError(redirectionUrl)) {
                return res.status(redirectionUrl.code).json(redirectionUrl)
            }

            res.status(302).redirect(redirectionUrl)
        } catch (error) {
            return res.status(500).json(
                { code: 500, message: "Internal server error" }
            )           
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
        } catch (error) {
            return res.status(500).json(
                { code: 500, message: "Internal server error" }
            )
        }
    }

    public getCreatedUrls = async (req: Request, res: Response) => {
        try {
            const payload = extractJwtPayload(
                extractToken(req) as string
            )

            const urls = await this.getUrlsByOwnerEmail.execute(payload?.email as string)
            if (isError(urls)) {
                return res.status(urls.code).json(urls)
            }

            return res.status(200).json(urls)

        } catch (error) {
            return res.status(500).json(
                { code: 500, message: "Internal server error" }
            )
        }
    }
}