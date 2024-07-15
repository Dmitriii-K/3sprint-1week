import { ObjectId } from "mongodb";

export type CommentInputModel = {
  content:	string;
};

export type CommentatorInfo = {
  userId:	string;
  userLogin:	string;
};

export type CommentViewModel = {
  id:string;
  content:	string;
  createdAt:	string;
  commentatorInfo: CommentatorInfo;
};

export type CommentDBType = {
  _id?: ObjectId;
  postId?: string;
  content:	string;
  createdAt:	string;
  commentatorInfo: CommentatorInfo;
}

export type PaginatorCommentViewModelDB = {
  pagesCount:	number;
  page:	number;
  pageSize:	number;
  totalCount:	number;
  items: CommentViewModel[];
};
export type TypeCommentPagination = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};