import { Client } from "cassandra-driver";

export interface ICassandraInstance {
    get client(): Client;
}