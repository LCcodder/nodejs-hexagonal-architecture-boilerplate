export declare type Url = {
    id: string;
    to: string;
    ownerEmail?: string;
    createdAt: string;
}

export declare type UrlToGetOne = Url & { usesCount: number }
export declare type UrlToGetMany = Url
export declare type UrlToCreate = Pick<Url, "to" | "ownerEmail">