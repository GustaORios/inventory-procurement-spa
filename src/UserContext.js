import { createContext, useState } from "react";

//first creat the context
export const UserContext = createContext();

export function UserProvider({children}){
    const [user, setUser] = useState(null);

    const login = () =>{
        setUser({name: 'Admin', role: "Admin"});
    }

    const logout = () =>{setUser(null)};

    return(
        <UserContext.Provider value={{user, login,logout}}>
            {children}
        </UserContext.Provider>
    )
}