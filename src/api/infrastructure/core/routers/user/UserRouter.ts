import { Application } from "express";
import UserController from "../../../../adapters/controllers/user/UserController";
import { validateSchema } from "../../middlewares/ValidationMiddleware";
import CreateUserSchema from "../../validation/schemas/user/CreateUserSchema";
import { authenticate } from "../../middlewares/AuthMiddleware";

export const routeUserEndpoints = (app: Application, userController: UserController): void => {
    app.post("/users", validateSchema(CreateUserSchema), userController.registerUser)
    app.get("/users/me", authenticate, userController.getProfile)
}