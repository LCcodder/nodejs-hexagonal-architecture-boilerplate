import 'reflect-metadata';
import { container } from 'tsyringe';
import { UserRepository } from './adapters/repositories/user/UserRepository';
import { GetUserByEmailUseCase } from './application/user/usecases/GetUserByEmail';
import { CreateUserUseCase } from './application/user/usecases/CreateUser';
import UserController from './adapters/controllers/user/UserController';
import AuthController from './adapters/controllers/auth/AuthController';
import { AuthorizeUseCase } from './application/auth/usecases/Authorize';
import { CassandraInstance } from './infrastructure/database/CassandraInstance';
import { connectAndGetRedisInstance } from './infrastructure/cache/RedisInstance';
import { RedisClientType } from 'redis';
import { UrlRepository } from './adapters/repositories/url/UrlRepository';
import UrlController from './adapters/controllers/url/UrlController';
import { CreateUrlUseCase } from './application/url/usecases/CreateUrl';
import { GetRedirectByIdUseCase } from './application/url/usecases/GetRedirectById';
import { GetUrlByIdUseCase } from './application/url/usecases/GetUrlById';
import { CONFIG } from './config/Config';
import { GetUrlsByOwnerEmailUseCase } from './application/url/usecases/GetUrlsByOwnerEmail';

export type CoreDependencies = {
    userController: UserController,
    authController: AuthController,
    urlController: UrlController
}

export const injectDependencies = async (): Promise<CoreDependencies> => {
    const cassandraClient = new CassandraInstance(
        CONFIG.databaseHost,
        CONFIG.datacenter,
        CONFIG.keyspace
    ).client

    const redisClient = await connectAndGetRedisInstance(CONFIG.redisConnectionString)
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