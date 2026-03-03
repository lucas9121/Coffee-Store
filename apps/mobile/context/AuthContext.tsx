import React, {createContext, useContext, useMemo, useState} from "react";

type AccountType = "guest" | "user" | "worker";

type AuthContextValue = {
  accountType: AccountType;
  setAccountType: React.Dispatch<React.SetStateAction<AccountType>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children} : {children: React.ReactNode}){
  const [accountType, setAccountType] = useState<AccountType>("guest");

  const value = useMemo(() => ({accountType, setAccountType}), [accountType]);

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