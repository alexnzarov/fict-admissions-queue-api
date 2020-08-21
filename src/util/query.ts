import { Like } from "typeorm";

export const searchQuery = (params: string[], query) => {
  const { search, skip, take } = query;
  const temp: any = {};

  if (search) {
    temp.where = params.map(p => ({ [p]: Like(`%${search}%`) }));
  }

  if (skip) {
    temp.skip = parseInt(skip);
  }

  if (take) {
    temp.take = parseInt(take);
  }

  return temp;
};