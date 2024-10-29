import { Application } from "express";
import AuthController from "../../../../adapters/controllers/auth/AuthController";
import { validateSchema } from "../../middlewares/ValidationMiddleware";
import AuthorizeSchema from "../../validation/schemas/auth/AuthorizeSchema";

export const routeAuthEndpoints = (app: Application, authController: AuthController): void => {
    app.post("/auth", validateSchema(AuthorizeSchema), authController.authorizeUser)
}