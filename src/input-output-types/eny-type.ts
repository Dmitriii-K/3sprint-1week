import { OutputErrorsType } from "./output-errors-type";

export enum SortDirection {
  asc,
  desc,
}

export type BlogPostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type BlgId = {
  id: string;
};

export type ComId = {
  id: string;
}

export enum resultStatus {
  Success = "Success",
  NotFound = "NotFound",
  Forbidden = "Forbidden",
  Unauthorized = "Unauthorized",
  BedRequest = "BedRequest"
}

export type Result<T = null> = {
  status: resultStatus;
  errorMessage?: OutputErrorsType;
  data: T
}

export type tokenType = {
  token: string;
}