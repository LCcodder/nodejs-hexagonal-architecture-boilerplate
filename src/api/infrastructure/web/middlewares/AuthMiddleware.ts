import { NextFunction, Request, Response } from "express";
import { extractToken } from "../../../shared/utils/TokenExtractor";
import { verify } from "jsonwebtoken";
import { CONFIG } from "../../../shared/config/Config";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractToken(req)
        if (!token) {
            return res.status(401).json({
                code: 401,
                message: "Auth token not found"
            })
        }

        verify(token, CONFIG.jwtSecret)
        
        next()
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "Auth token is invalid"
        })
    }
}