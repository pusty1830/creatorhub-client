import { createContext, Dispatch } from "react";
import { isLoggedIn } from "./axiosClient";

/**
 * Authentication/Authorization context for managing
 * authenticating/ed and authorizing/ed users
 */
export const AuthContext = createContext({
  isAuthenticated: isLoggedIn(),
  dispatch: () => {},
});
