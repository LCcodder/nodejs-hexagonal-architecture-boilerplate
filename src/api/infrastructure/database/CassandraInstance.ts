import {Client, auth as Auth} from "cassandra-driver"
import { ICassandraInstance } from "./ICassandraInstance";
import { logger } from "../../utils/PinoLogger";



export class CassandraInstance implements ICassandraInstance {
    private client_: Client;
    
    constructor(
        hoster: string,
        datacenter: string,
        keyspace: string,
        auth?: {
            username: string;
            password: string;
        }
    ) {
        this.client_ = new Client(
            {
                contactPoints: [hoster],
                localDataCenter: datacenter,
                keyspace: keyspace,
                authProvider: auth ? new Auth.PlainTextAuthProvider(auth?.username, auth?.password) : undefined
            }
        );
        logger.info(`Connected to Cassandra instance at ${hoster} - ${datacenter} at keyspace: ${keyspace}\n`)
    }

    public get client(): Client {
        return this.client_;
    }
}
