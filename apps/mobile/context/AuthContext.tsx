import React, {createContext, useContext, useMemo, useState, useEffect} from "react";
import { getRefreshToken, deleteRefreshToken, setRefreshToken } from "@/services/tokenStorage";

type AccountType = "guest" | "user" | "worker";


type AuthContextValue = {
  accountType: AccountType;
  setAccountType: React.Dispatch<React.SetStateAction<AccountType>>;

  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  
  isInitializing: boolean;
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>;

  hasRefreshToken: boolean;

  logout: () => Promise<void>;

  login: (
    accessToken: string,
    refreshToken: string,
    accountType: AccountType
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children} : {children: React.ReactNode}){
  const [accountType, setAccountType] = useState<AccountType>("guest");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [hasRefreshToken, setHasRefreshToken] = useState<boolean>(false);

  // bootstrapAuth can use state setters directly from inside AuthProvider.
  async function bootstrapAuth(): Promise<void> {
    const refreshToken = await getRefreshToken();
    console.log("Refresh token found:", refreshToken);
    setHasRefreshToken(!!refreshToken);
    setIsInitializing(false);
  };
  
  async function logout(): Promise<void> {
    await deleteRefreshToken();
    setAccessToken(null);
    setAccountType("guest");
    setHasRefreshToken(false);
    setIsInitializing(false)
  };

  async function login(
    accessToken: string,
    refreshToken: string,
    accountType: AccountType
  ): Promise<void> {
    await setRefreshToken(refreshToken);
    setAccessToken(accessToken);
    setAccountType(accountType);
    setHasRefreshToken(true);
    setIsInitializing(false);
  };

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const value = useMemo(
    () => ({
      accountType, 
      setAccountType,
      accessToken,
      setAccessToken,
      isInitializing,
      setIsInitializing,
      hasRefreshToken,
      logout,
      login
    }), 
    [accountType, accessToken, isInitializing, hasRefreshToken]
  );

  return( 
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(){
  const ctx = useContext(AuthContext);
  if(!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

