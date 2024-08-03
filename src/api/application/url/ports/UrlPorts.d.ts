import { _Error } from "../../../types/_Error";
import { Url, UrlToCreate, UrlToGetMany, UrlToGetOne } from "../domain/Url";

export declare interface CreateUrlPort {
    execute(url: UrlToCreate): Promise<UrlToGetOne | _Error>
}

export declare interface GetRedirectByIdPort {
    execute(id: string): AsyncGenerator<undefined | string | _Error>
}

export declare interface GetUrlByIdPort {
    execute(id: string): Promise<UrlToGetOne | _Error>
}

export declare interface GetUrlsByOwnerEmailPort {
    execute(email: string): Promise<UrlToGetMany[] | _Error>
}