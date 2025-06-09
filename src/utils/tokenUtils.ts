import jwt from "jsonwebtoken";
import {
  AT_VALIDITY_DURATION,
  RT_VALIDITY_DURATION,
} from "../constants/appConstants";

export const generateAccessToken = (user: any): string => {
  const accessToken = jwt.sign(user, process.env.AT_SIGNING_SECRET as string, {
    expiresIn: AT_VALIDITY_DURATION,
  });
  return accessToken;
};

export const generateRefreshToken = (user: any): string => {
  const refreshToken = jwt.sign(user, process.env.RT_SIGNING_SECRET as string, {
    expiresIn: RT_VALIDITY_DURATION,
  });
  return refreshToken;
};

export enum TokenVerificationStatus {
  VALID_TOKEN = "VALID_TOKEN",
  EXPIRED_TOKEN = "EXPIRED_TOKEN",
  INVALID_TOKEN = "INVALID_TOKEN",
}

export const verifyAccessToken = (
  user: any,
  token: string
): TokenVerificationStatus => {
  try {
    const decodedTokenData: any = jwt.verify(
      token,
      process.env.AT_SIGNING_SECRET as string
    );
    if (decodedTokenData.userId === user.userId) {
      return TokenVerificationStatus.VALID_TOKEN;
    }
    return TokenVerificationStatus.INVALID_TOKEN;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return TokenVerificationStatus.EXPIRED_TOKEN;
    }
  }
  return TokenVerificationStatus.INVALID_TOKEN;
};

export const verifyRefreshToken = (
  user: any,
  token: string
): TokenVerificationStatus => {
     try {
       const decodedTokenData: any = jwt.verify(
         token,
         process.env.RT_SIGNING_SECRET as string
       );
       if (decodedTokenData.userId === user.userId) {
         return TokenVerificationStatus.VALID_TOKEN;
       }
       return TokenVerificationStatus.INVALID_TOKEN;
     } catch (error: any) {
       if (error.name === "TokenExpiredError") {
         return TokenVerificationStatus.EXPIRED_TOKEN;
       }
     }
     return TokenVerificationStatus.INVALID_TOKEN;
}