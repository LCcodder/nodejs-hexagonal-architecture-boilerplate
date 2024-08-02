import { Request } from "express";

export const extractToken = (req: Request): string | undefined => {
    return req.header("Authorization")?.replace("Bearer ", "")
} 