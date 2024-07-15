import { Request, Response } from "express";
import { LoginInputModel, LoginSuccessViewModel, RegistrationConfirmationCodeModel, RegistrationEmailResending } from "../input-output-types/auth-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { jwtService } from "../adapters/jwtToken";
import { UserInputModel } from "../input-output-types/users-type";
import { authService } from "./authService";
import { bcryptService } from "../adapters/bcrypt";
import { AuthRepository } from "./authRepository";


export class AuthController {
  static authLoginUser = async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response<LoginSuccessViewModel | OutputErrorsType>
  ) => {
    try {
      const authUser = await authService.checkCredentials(req.body.loginOrEmail);
      if (!authUser) {
        res.status(401).json({ errorsMessages: [{field: 'user', message: 'user not found'}] });
      } else {
        const isCorrect = await bcryptService.comparePasswords(req.body.password, authUser?.password);
        if(isCorrect) {
          const{accessToken, refreshToken} = jwtService.generateToken(authUser);
          res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
          .status(200).json({accessToken});
          return;
        } else {
          res.status(401).json({ errorsMessages: [{field: 'password and login', message: 'password or login is wrong'}] });
        }
    };
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  };

  static authRefreshToken = async (req: Request, res: Response) => {
    try {
      const token = await AuthRepository.findRefreshTokenFromDB(req.cookies.refreshToken);
      if(token) {
        res.sendStatus(401);
        return
      }
      if(!token) {
        AuthRepository.insertTokenFromDB(req.cookies.refreshToken)
      };
      const result = await authService.updateRefreshToken(req.user);
      const {accessToken, refreshToken} = result!;
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        .status(200).json({accessToken});
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  };

  static authRegistration = async (req:Request<{}, {}, UserInputModel>, res: Response) => {
    try {
      const registrationResult = await authService.registerUser(req.body);
      if(registrationResult) {
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  };

  static authRegistrationConfirmation = async (req: Request<{}, {}, RegistrationConfirmationCodeModel>, res: Response) => {
    try {
      const result = await authService.confirmEmail(req.body.code);
      if(result) {
        res.sendStatus(204);
      } else {
        res.status(400).send({errorsMessages: [{field: "code", message: " Code validation failure "}]})
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  };

  static authRegistrationEmailResending = async (req: Request<{}, {}, RegistrationEmailResending>, res: Response) => {
    try {
      const emailResending = await authService.resendEmail(req.body.email);
      if (emailResending) {
        res.sendStatus(204);
      } else {
        res.status(400).json({ errorsMessages: [{ message: 'eanother error', field: 'email',}]
        });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  };

  static authLogout = async (req: Request, res: Response) => {
    try {
      const token = await AuthRepository.findRefreshTokenFromDB(req.cookies.refreshToken)
      if(token) {
        res.sendStatus(401)
        return
      }
      const result = await authService.authUserLogout(req.cookies.refreshToken);
      if(result) {
        res.clearCookie('refreshToken');
        res.sendStatus(204)
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  }
};


