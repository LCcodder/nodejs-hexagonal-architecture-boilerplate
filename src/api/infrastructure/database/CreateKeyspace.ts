import { Client } from "cassandra-driver";

export const createKeyspace = async (client: Client) => {
    try {
        await client.connect()
        console.log(`[Info] Creating keyspace...`)
        const query = `
            CREATE KEYSPACE IF NOT EXISTS miniurl WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 3 };
            CREATE TABLE miniurl.urls_by_id ( id text, "to" text, "ownerEmail" text, "createdAt" timestamp, PRIMARY KEY(id) );
            CREATE TABLE miniurl.urls_uses_count ( id text, "usesCount" counter, PRIMARY KEY(id) );
            CREATE TABLE miniurl.users_by_email (email text, password text, username text, "createdAt" timestamp, PRIMARY KEY(email) );
        `

        await client.execute(query)
    } catch(error) {
        console.log(`[Info] keyspace already created, no execution needed`)
    }
}