import type { ApiResponse } from "./apiResponse";

//  Register
export type UserRegisterRequest = {
  username: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER"; // pode expandir conforme sua API
};

export type UserRegisterData = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
};

export type UserRegisterResponse = ApiResponse<UserRegisterData>;

//  Login
export type UserLoginRequest = {
  username: string;
  password: string;
};

export type UserLoginData = {
  id: string;
  username: string;
  token: string;
  email: string;
  role: string;
};

export type UserLoginResponse = ApiResponse<UserLoginData>;
