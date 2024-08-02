import 'reflect-metadata';

import { Client } from "cassandra-driver";
import { Url } from "../../../application/url/domain/Url";
import { _Error } from "../../../types/_Error";
import { DeepOptional } from "typing-assets";
import { stringifyForQuery } from "../../../utils/StringifyInterceptor";
import { Repository } from "../ports/Repository";
import { User } from "../../../application/user/domain/User";
import { inject, injectable, singleton } from "tsyringe";

@singleton()
export class UserRepository extends Repository<User> {
    constructor(client: Client) {
        super(client);
    }

    public override async insert(data: User): Promise<true> {
        let order: string[] = []
        for (const key in data) {
            order.push(`"${key}"`)
        }

        const query: string = `
            INSERT INTO users_by_email (${order.toString()})
            VALUES (${Object.values(data).map(v => stringifyForQuery(v))});
        `
        await this.client.execute(query)
        return true
        
    }

    public override async update(primaryKey: string, data: DeepOptional<User>): Promise<true> {
        let updateString = ""
        for (const key in data) {
            updateString += `"${key}" = ${stringifyForQuery(data[key as keyof typeof data])}`
        }
        const query: string = `UPDATE users_by_email SET ${updateString} WHERE email='${primaryKey}';`

        await this.client.execute(query)
        return true
        
    }
    
    public override async get(primaryKey: string): Promise<User | null> {
        const query: string = `
            SELECT * FROM users_by_email WHERE email='${primaryKey}';
        `
        const result = await this.client.execute(query)
        return result.rows.length ? result.rows[0] as unknown as User : null
        
    }

    public override async getAll(key: string): Promise<User[]> {
        return []
    }

    public override async delete(primaryKey: string): Promise<true> {
        const query: string = `
            DELETE FROM users_by_email WHERE email='${primaryKey}';
        `
        await this.client.execute(query)
        return true
    }
}

// const c = new CassandraInstance(
//     "localhost",
//     "datacenter1",
//     "miniurl"
// )
// c.client.connect().then(_ => {

//     const r = new UsersRepository(c.client)
//     const user: User = {
//         email: "dasjdai",
//         password: "sdaada",
//         username: "dsaaada",
//         addedAt: new Date().toISOString(),
//         urlsLimit: 4
//     }
//     //r.insert(user)
//     r.update("dasjdai", {addedAt: new Date().toISOString()})
// })