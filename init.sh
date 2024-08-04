#!/usr/bin/env bash


echo "Creating keyspace"
cqlsh cassandra -u cassandra -p cassandra -e "CREATE KEYSPACE IF NOT EXISTS miniurl WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 3 };"
cqlsh cassandra -u cassandra -p cassandra -e "USE miniurl;"
cqlsh cassandra -u cassandra -p cassandra -e "CREATE TABLE miniurl.urls_by_id ( id text, "to" text, "ownerEmail" text, "createdAt" timestamp, PRIMARY KEY(id) );" 
cqlsh cassandra -u cassandra -p cassandra -e "CREATE TABLE miniurl.urls_uses_count ( id text, "usesCount" counter, PRIMARY KEY(id) );" 
cqlsh cassandra -u cassandra -p cassandra -e "CREATE TABLE miniurl.users_by_email (email text, password text, username text, "createdAt" timestamp, PRIMARY KEY(email) );"