export type GetContentsDetailResponse =
  | GetContentsDetailData
  | GetContentsDetailError;

export type GetContentsDetailData = {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
};

export type GetContentsDetailError = {
  message: string;
  status: string;
};
