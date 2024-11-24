import { Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../errors/CommonErrors";

export const InternalServerError = (res: Response) => {
    return res.status(500).json(
        INTERNAL_SERVER_ERROR
    )
}