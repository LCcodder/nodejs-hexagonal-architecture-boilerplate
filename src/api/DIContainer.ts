import 'reflect-metadata';
import { container } from 'tsyringe';
import { UserRepository } from './adapters/repositories/user/UserRepository';
import { GetUserByEmailUseCase } from './application/user/usecases/GetUserByEmail';
import { CreateUserUseCase } from './application/user/usecases/CreateUser';
import UserController from './adapters/controllers/user/UserController';
import AuthController from './adapters/controllers/auth/AuthController';
import { AuthorizeUseCase } from './application/auth/usecases/Authorize';
import { RedisClientType } from 'redis';
import { UrlRepository } from './adapters/repositories/url/UrlRepository';
import UrlController from './adapters/controllers/url/UrlController';
import { CreateUrlUseCase } from './application/url/usecases/CreateUrl';
import { GetRedirectByIdUseCase } from './application/url/usecases/GetRedirectById';
import { GetUrlByIdUseCase } from './application/url/usecases/GetUrlById';
import { GetUrlsByOwnerEmailUseCase } from './application/url/usecases/GetUrlsByOwnerEmail';
import { Client } from 'cassandra-driver';

export type CoreDependencies = {
    userController: UserController,
    authController: AuthController,
    urlController: UrlController
}

export const injectDependencies = async (
    cassandraClient: Client, 
    redisClient: RedisClientType): Promise<CoreDependencies> => {

    container.register<RedisClientType>(
        "RedisClient",
        { useValue: redisClient }
    )
    
    container.register<UserRepository>(
        "UserRepository", 
        { useValue: new UserRepository(cassandraClient) }
    )

    container.register<UrlRepository>(
        "UrlRepository",
        { useValue: new UrlRepository(cassandraClient) }
    )


    container.registerSingleton("CreateUrlUseCase", CreateUrlUseCase)
    container.registerSingleton("GetRedirectByIdUseCase", GetRedirectByIdUseCase)
    container.registerSingleton("GetUrlByIdUseCase", GetUrlByIdUseCase)
    container.registerSingleton("GetUrlsByOwnerEmailUseCase", GetUrlsByOwnerEmailUseCase)
    container.registerSingleton("UrlController", UrlController)

    container.registerSingleton("GetUserByEmailUseCase", GetUserByEmailUseCase)
    container.registerSingleton("CreateUserUseCase", CreateUserUseCase)
    container.registerSingleton("UserController", UserController)
    container.registerSingleton("AuthorizeUseCase", AuthorizeUseCase)
    container.registerSingleton("AuthController", AuthController)

    return {
        userController: container.resolve(UserController),
        authController: container.resolve(AuthController),
        urlController: container.resolve(UrlController)
    }
}