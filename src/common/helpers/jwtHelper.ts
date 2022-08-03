import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export function generateBearerToken(data: object, exp: string) : string {
    return jwt.sign(data, process.env.BEARER_TOKEN_SECRET as jwt.Secret, {
        expiresIn: exp
    });
}

export function generateRefreshToken(data: object, exp: string) : string {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET as jwt.Secret, {
        expiresIn: exp
    });
}

export function authenticateBearerToken(token: string): any {
    return jwt.verify(token, process.env.BEARER_TOKEN_SECRET as jwt.Secret, (err, payload) => {
        if (err){
            return null;
        }
        return payload;
    });
}

export function authenticateRefreshToken(token: string): any {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as jwt.Secret, (err, payload) => {
        if (err){
            return null;
        }
        return payload;
    });
}