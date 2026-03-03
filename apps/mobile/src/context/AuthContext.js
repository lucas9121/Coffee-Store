import React, {createContext, useContext, useMemo, useState} from "react";

const AuthContext = createContext(null);

export function AuthProvider({children}){
  const [accountType, setAccountType] = useState("guest");

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