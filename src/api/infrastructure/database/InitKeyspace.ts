import { Client } from "cassandra-driver";
import { logger } from "../../shared/utils/PinoLogger";

export const connectAndInitKeyspace = async (client: Client) => {
    try {
        await client.connect()
        logger.info(`Creating keyspace...`)
        const queries = [
            "CREATE KEYSPACE IF NOT EXISTS miniurl WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 3 };",
            "USE miniurl;",
            'CREATE TABLE miniurl.urls_by_id ( id text, "to" text, "ownerEmail" text, "createdAt" timestamp, PRIMARY KEY(id) );',
            'CREATE TABLE miniurl.urls_uses_count ( id text, "usesCount" counter, PRIMARY KEY(id) );',
            'CREATE TABLE miniurl.users_by_email (email text, password text, username text, "createdAt" timestamp, PRIMARY KEY(email) );'
        ]
        for (const query of queries) {
            await client.execute(query)
        }
    } catch(error) {
        logger.warn(error)
    }
}