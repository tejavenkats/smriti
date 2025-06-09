import { Request, Response } from "express";
import { TokenVerificationStatus, generateAccessToken, generateRefreshToken, verifyAccessToken } from "../utils/tokenUtils";

export const authenticateRequests = (req: Request, res: Response, next: any) => {
    if (!req.headers.authorization) {
        res.status(401).send({
            success: false,
            message: "Authorization header not found",
        });
    }

    const token = (req.headers["Authorisation"] as string)?.split(" ")?.[1];
    const userId = req.headers.userId;
    const atStatus = verifyAccessToken({
        userId: userId,
    }, token);

    if(atStatus === TokenVerificationStatus.INVALID_TOKEN) {
        res.status(401).send({
            success: false,
            message: "User unauthorised",
            reason: "Invalid token",
        })
    }

    if(atStatus === TokenVerificationStatus.EXPIRED_TOKEN) {
        const newAtToken = generateAccessToken({
            userId: userId,
        })
        const newRtToken = generateRefreshToken({
            userId: userId,
        })
        res.appendHeader("Authorisation", `Bearer ${newAtToken}`);
        res.appendHeader("RefreshToken", `Bearer ${newRtToken}`);
        next();
    }

    if(atStatus === TokenVerificationStatus.VALID_TOKEN) {
        next();
    }
}