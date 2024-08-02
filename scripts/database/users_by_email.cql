CREATE TABLE miniurl.users_by_email (
    email text,
    password text,
    username text,
    "createdAt" timestamp,
    PRIMARY KEY(email)
);