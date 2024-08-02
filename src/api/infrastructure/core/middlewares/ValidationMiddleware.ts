import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateSchema = (schema: AnyZodObject) =>
async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        return next();
    } catch (error) {
        return res.status(400).json({
            code: 400,
            message: "Input data is not valid"
        })  
    }
}