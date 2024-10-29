import { Response } from "express";

export const InternalServerError = (res: Response) => {
    return res.status(500).json(
        { code: 500, message: "Internal server error" }
    )
}