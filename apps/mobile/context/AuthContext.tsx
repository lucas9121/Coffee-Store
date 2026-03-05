import React, {createContext, useContext, useMemo, useState} from "react";

type AccountType = "guest" | "user" | "worker";


type AuthContextValue = {
  accountType: AccountType;
  setAccountType: React.Dispatch<React.SetStateAction<AccountType>>;

  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  
  isInitializing: boolean;
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children} : {children: React.ReactNode}){
  const [accountType, setAccountType] = useState<AccountType>("guest");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true)

  const value = useMemo(
    () => ({
      accountType, 
      setAccountType,
      accessToken,
      setAccessToken,
      isInitializing,
      setIsInitializing
    }), 
    [accountType, accessToken, isInitializing]
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
}