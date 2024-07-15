import { ObjectId } from "mongodb";

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type BlogDbType = {
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type PaginatorBlogViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModel[];
};

export type TypeBlogHalper = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
export type TypePostForBlogHalper = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
