import { Application } from "express";
import UrlController from "../../../../adapters/controllers/url/UrlController";
import { authenticate } from "../../middlewares/AuthMiddleware";
import { validateSchema } from "../../middlewares/ValidationMiddleware";
import CreateUrlSchema from "../../validation/schemas/url/CreateUrlSchema";

export const routeUrlEndpoints = (app: Application, urlController: UrlController): void => {
    app.post("/urls", validateSchema(CreateUrlSchema), urlController.registerUrl)
    app.get("/:id", urlController.redirect)
    app.get("/urls/my/", authenticate, urlController.getCreatedUrls)

    app.get("/urls/:id/", urlController.getUrl)
}