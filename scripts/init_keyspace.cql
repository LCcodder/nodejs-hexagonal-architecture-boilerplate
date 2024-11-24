CREATE KEYSPACE IF NOT EXISTS miniurl WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 3 };
CREATE TABLE miniurl.urls_by_id ( id text, "to" text, "ownerEmail" text, "createdAt" timestamp, PRIMARY KEY(id) );
CREATE TABLE miniurl.urls_uses_count ( id text, "usesCount" counter, PRIMARY KEY(id) );
CREATE TABLE miniurl.users_by_email (email text, password text, username text, "createdAt" timestamp, PRIMARY KEY(email) );