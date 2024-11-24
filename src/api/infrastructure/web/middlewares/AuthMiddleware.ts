import { NextFunction, Request, Response } from "express";
import { extractToken } from "../../../shared/utils/TokenExtractor";
import { verify } from "jsonwebtoken";
import { CONFIG } from "../../../shared/config/Config";
import { TOKEN_IS_INVALID, TOKEN_NOT_FOUND } from "../../../shared/errors/UrlErrors";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractToken(req)
        if (!token) {
            return res.status(401).json(TOKEN_NOT_FOUND)
        }

        verify(token, CONFIG.jwtSecret)
        
        next()
    } catch (error) {
        return res.status(401).json(TOKEN_IS_INVALID)
    }
}