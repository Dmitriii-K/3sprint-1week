import  jwt from 'jsonwebtoken';
import { SETTINGS } from '../settings';
import { UserDBModel } from '../input-output-types/users-type';
import {  WithId } from 'mongodb';

export type AccessPayloadType  = {
  userId: string;
  email: string,
    login: string,
}

export const jwtService = {
generateToken (user: WithId<UserDBModel>) {
  const payload: AccessPayloadType = {
    userId: user._id!.toString(),
    email: user.email,
    login: user.login,
  };
  const optionsAccessToken = {
    expiresIn: '10s' 
  };
  const optionsRefreshToken = {
    expiresIn: '20s' 
  };
  const secretKey = SETTINGS.JWT_SECRET_KEY; 
  const accessToken:string = jwt.sign(payload, secretKey, optionsAccessToken);
  const refreshToken:string = jwt.sign(payload, secretKey, optionsRefreshToken);
  return {accessToken, refreshToken};
},
getUserIdByToken (token:string) : AccessPayloadType | null {
    try {
    return jwt.verify(token, SETTINGS.JWT_SECRET_KEY) as AccessPayloadType;
    } catch (error) {
        return null;
      }
  }
}
