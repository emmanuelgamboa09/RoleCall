export interface ApiError {
  name: "ApiError";
  status: number;
  message: string;
}

export default (status: number, message: string) => {
  throw { name: "ApiError", status, message };
};
