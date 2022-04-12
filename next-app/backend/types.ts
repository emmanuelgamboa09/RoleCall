import { FilterQuery, Query, QueryOptions, UpdateQuery } from "mongoose";

export interface User {
  _id?: string;
  authId: string;
  name?: string;
}

export interface HTTPBody {
  [key: string]: any;
}

type QueryResult<Model> = Query<any, any, any, any> | Promise<Model>;

export interface FindById<Model> {
  (id: string, options?: QueryOptions): QueryResult<Model | null>;
}

export interface FindOne<Model> {
  (
    filter: FilterQuery<Model>,
    options?: QueryOptions,
  ): QueryResult<Model | null>;
}

export interface FindMany<Model> {
  (filter: FilterQuery<Model>): QueryResult<Model[]>;
}

export interface FindByIdAndUpdate<Model> {
  (id: string, doc: Partial<Model>): QueryResult<Model | null>;
}

export interface Update<Model> {
  (
    filter: FilterQuery<Model>,
    update: UpdateQuery<Model>,
    options?: QueryOptions,
  ): QueryResult<Model | null>;
}

export interface Insert<Model> {
  (doc: Model): QueryResult<Model>;
}
