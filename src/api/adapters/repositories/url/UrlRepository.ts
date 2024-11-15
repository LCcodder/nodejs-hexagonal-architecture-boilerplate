import { Client } from "cassandra-driver";
import { Url, UrlToGetOne } from "../../../application/url/domain/Url";
import { _Error } from "../../../shared/types/_Error";
import { DeepOptional, excludeProperties } from "typing-assets";
import { stringifyForQuery } from "../../../shared/utils/StringifyInterceptor";
import { Repository } from "../ports/Repository";

export class UrlRepository extends Repository<Url> {
    constructor(client: Client) {
        super(client);
    }

    public override async insert(data: Url): Promise<true> {
        const urlQuery: string = `
            INSERT INTO urls_by_id (id, "to", "ownerEmail", "createdAt")
            VALUES (${Object.values(data).map(v => stringifyForQuery(v))});
        `
        await this.client.execute(urlQuery)

        const counterQuery: string = `
            UPDATE urls_uses_count SET "usesCount" = "usesCount" + 0
            WHERE id = '${data.id}';
        `
        await this.client.execute(counterQuery)

        return true
    }

    public override async get(primaryKey: string): Promise<UrlToGetOne | null> {
        const urlQuery: string = `
            SELECT * FROM urls_by_id WHERE id='${primaryKey}';
        `
        const urlResult = await this.client.execute(urlQuery)
        
        const counterQuery: string = `
            SELECT * FROM urls_uses_count WHERE id='${primaryKey}';
        `

        const counterResult = await this.client.execute(counterQuery)

        return urlResult.rows.length && counterResult.rows.length ? 
            {
                ...urlResult.rows[0], 
                ...excludeProperties(counterResult.rows[0], "id")
            } as unknown as UrlToGetOne
            : null
    }

    public override async getAll(key: string): Promise<Url[]> {
        const query: string = `
            SELECT * FROM urls_by_id WHERE "ownerEmail"='${key}' ALLOW FILTERING;
        `
        const result = await this.client.execute(query)
        return result.rows as unknown as Url[]
    }

    public override async update(primaryKey: string, data: DeepOptional<Url>): Promise<true> {
        

        let updateString = ""
        for (const key in data) {
            updateString += `"${key}" = ${stringifyForQuery(data[key as keyof typeof data])}`
        }

        const query: string = `UPDATE urls_by_id SET ${updateString} WHERE id='${primaryKey}';`
        await this.client.execute(query)
        return true
        
    }

    public override async delete(primaryKey: string): Promise<true> {
        const urlQuery: string = `
            DELETE FROM urls_by_id WHERE id='${primaryKey}';
        `
        await this.client.execute(urlQuery)

        const counterQuery: string = `
            DELETE FROM urls_uses_count WHERE id='${primaryKey}'
        `
        return true
        
    }
}