import { decode } from 'jsonwebtoken'

export const extractJwtPayload = (jwt: string): { email: string } | undefined => {
    return decode(jwt) as { email: string }
}