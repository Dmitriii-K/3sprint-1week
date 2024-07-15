import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { SETTINGS } from "../settings";
import { blogCollection, userCollection } from "../db/mongo-db";
import { ObjectId, WithId } from "mongodb";
import { SortDirection } from "../input-output-types/eny-type";
import { jwtService } from "../adapters/jwtToken";
import { UserDBModel } from "../input-output-types/users-type";

const urlPattern =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
const imailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const loginPattern = /^[a-zA-Z0-9_-]*$/;

export const registrationEmail = [
  body("email")
  .isString()
  .withMessage("not string")
  .trim()
  .not()
  .isEmpty()
  .matches(imailPattern)
  .isEmail()
  .withMessage("Invalid email format")
];

export const validationCode = [
  body("code")
  .isString()
  .trim()
  .not()
  .isEmpty()
  .withMessage("code is not string"),
];

export const commentsValidation = [
  body("content")
  .isString()
  .trim()
  .not()
  .isEmpty()
  .isLength({min: 20, max: 300 })
  .withMessage("content has incorrect values"),
];

export const authCheckValidation = [
  body("loginOrEmail")
  .isString()
  .withMessage("not string")
  .trim()
  .not()
  .isEmpty(),
  body("password")
  .isString()
  .withMessage("not string")
  .trim()
  .not()
  .isEmpty(),
]

export const blogInputValidation = [
  body("name")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 15 })
    .withMessage("Имя слишком длинное"),
  body("description")
    .isString()
    .withMessage("не строка")
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 500 })
    .withMessage("Описание превышает максимальное кол-во символов"),
  body("websiteUrl")
    .isString()
    .withMessage("не строка")
    .trim()
    .matches(urlPattern)
    .withMessage("not url")
    .isLength({ min: 1, max: 100 })
    .withMessage("более 100 символов"),
];

export const blogPostValidation = [
  body("title")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 30 })
    .withMessage("Заголовок слишком длинный"),
  body("shortDescription")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 100 })
    .withMessage("Описание превышает максимальное кол-во символов"),
  body("content")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 1000 })
    .withMessage("Содержание превышает максимальное кол-во символов"),
];

// export const paginationWithSortingPost = [
//   query("pageNumber").isInt(),
//   query("pageSize").isInt(),
//   query("sortBy").isString(),
//   query("sortDirection").isString(),
// ];
// export const paginationWithSortingBlog = [
//   paginationWithSortingPost,
//   query("searchNameTerm").isString(),
// ];

export const postInputValidation = [
  body("title")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 30 })
    .withMessage("Заголовок слишком длинный"),
  body("shortDescription")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 100 })
    .withMessage("Описание превышает максимальное кол-во символов"),
  body("content")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 1000 })
    .withMessage("Содержание превышает максимальное кол-во символов"),
  body("blogId")
    .isString()
    .custom(async (id) => {
      const ObtId = new ObjectId(id);
      const blog = await blogCollection.findOne({ _id: ObtId });
      if (!blog) {
        throw new Error("no blog!");
      }
      // return true;
    })
    .withMessage(""),
];

export const userInputValidation = [
  body("login")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(loginPattern)
    .withMessage("not login")
    .isLength({ min: 3, max: 10 })
    .withMessage("Invalid login"),
    // .custom(async (value) => {
    //   const user = await userCollection.findOne({ login: value });
    //   if (user) {
    //     return Promise.reject("Login is already in use");
    //   }
    // }),
  body("password")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage("Invalid password"),
  body("email")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(imailPattern)
    .isEmail()
    .withMessage("Invalid email format")
    // .custom(async (value) => {
    //   const user = await userCollection.findOne({ email: value });
    //   if (user) {
    //     return Promise.reject("Email is already in use");
    //   }
    // }),
];

export const userRegistrationValidation = [
  body("login")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(loginPattern)
    .withMessage("not login")
    .isLength({ min: 3, max: 10 })
    .withMessage("Invalid login")
    .custom(async (value : string) => {
      const user = await userCollection.findOne({ login: value });
      if (user) {
        return Promise.reject("Login is already in use");
      }
    }),
  body("password")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage("Invalid password"),
  body("email")
    .isString()
    .withMessage("not string")
    .trim()
    .not()
    .isEmpty()
    .matches(imailPattern)
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await userCollection.findOne({ email: value });
      if (user) {
        return Promise.reject("Email is already in use");
      }
    }),
];

export const inputCheckErrorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const e = validationResult(req);
  const errors = e.array({ onlyFirstError: true }) as {
    path: string;
    msg: string;
  }[];
  if (errors.length) {
    res.status(400).json({
      errorsMessages: errors.map((error) => {
        return { message: error.msg, field: error.path };
      }),
    });
    return;
  }
  next();
};

export const authMiddleware = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers["authorization"] as string;
  // console.log(auth);
  if (!auth) {
    res.status(401).json({});
    return;
  }
  // const buff = Buffer.from(auth.slice(6), "base64");
  // const decodedAuth = buff.toString("utf8");

  const buff2 = Buffer.from(SETTINGS.ADMIN, "utf8");
  const codedAuth = buff2.toString("base64");

  // if (decodedAuth === ADMIN_AUTH || auth.slice(0, 5) !== "Basic ") {
  //   res.status(401).json({});
  //   return;
  // }
  if (auth.slice(6) !== codedAuth || auth.slice(0, 6) !== "Basic ") {
    res.status(401).json({});
    return;
  }

  next();
};
const buff2 = Buffer.from(SETTINGS.ADMIN, "utf8");
export const codedAuth = buff2.toString("base64");

export const bearerAuth = async (req: Request, res: Response, next: NextFunction) => {
if(!req.headers.authorization) {
    res.status(401).json({});
    return;
  };
  const token = req.headers.authorization.split(" ")[1];
  const payload = jwtService.getUserIdByToken(token);
  if(!payload) return res.sendStatus(401);

  const user : WithId<UserDBModel> | null= await userCollection.findOne({ _id : new ObjectId(payload.userId)}); 
  if(user) {
    req.user = user;
    next();
    return
  } else {
    return res.status(401).json({});
  }
};

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  if(!req.cookies.refreshToken) {
    res.sendStatus(401);
    return
  };
  const token = req.cookies.refreshToken;
  const payload = jwtService.getUserIdByToken(token);
  if(!payload) return res.sendStatus(401);

  const user : WithId<UserDBModel> | null= await userCollection.findOne({ _id : new ObjectId(payload.userId)}); 
  if(user) {
    req.user = user;
    next();
    return
  } else {
    return res.status(401).json({});
  }
};

export const halper = (query: {
  [key: string]: string | number | undefined;
}): any => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection
      ? (query.sortDirection as SortDirection)
      : "desc",
    searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
  };
};

export const userPagination = (query: {
  [key: string]: string | number | undefined;
}): any => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection
      ? (query.sortDirection as SortDirection)
      : "desc",
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
  };
};

export const commentsPagination = (query: {
  [key: string]: string | number | undefined;
}): any => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection
      ? (query.sortDirection as SortDirection)
      : "desc",
  };
};
