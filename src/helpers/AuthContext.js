import { createContext } from "react";

export const AuthContext = createContext({
  authState: {},
  setAuthState: () => {}, // Provide a default no-op function
});
