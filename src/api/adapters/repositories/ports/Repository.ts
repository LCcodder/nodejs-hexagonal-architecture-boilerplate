import { Client } from "cassandra-driver";
import { _Error } from "../../../shared/types/_Error";
import { DeepOptional } from "typing-assets";


// There is no normal Cassandra ODM/ORM for Node.js, so I'm kinda improvising.. 
/**
 * @abstract
 * @access `public`
 * @constructor Requires `cassandra-diver` client
 */
export abstract class Repository<T> {
    constructor(protected client: Client) {}

    public abstract insert(data: T): Promise<true>;
    public abstract get(primaryKey: string): Promise<T | null>;
    public abstract update(primaryKey: string, data: DeepOptional<T>): Promise<true>;
    public abstract delete(primaryKey: string): Promise<true>;
    public abstract getAll(key: string): Promise<T[]>;
    public async executeRaw<TRawResult>(query: string): Promise<TRawResult> {
        const result = await this.client.execute(query)
        return result as TRawResult
    }
}