import { createContext, useContext, useEffect, useState } from "react";
import type User from "../models/user";
import { useLoaderContext } from "./loader_context";
import { verifyUser } from "../services/auth_service";
import { useMessageContext } from "./message_context";
import { disconnectSocket, listenToSocket } from "../socket";

type AuthContextType={
    user:User|null,
    setUser:React.Dispatch<React.SetStateAction<User | null>>,
    authChecked:boolean,
}

const AuthContext=createContext<AuthContextType|null>(null);

export function useAuthContext(){
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
}

export function AuthContextProvider({children}:{children:React.ReactNode}){

    const setLoading=useLoaderContext();
    const {addNewMessage}=useMessageContext();

    const [user,setUser]=useState<User|null>(null);
    const [authChecked,setAuthChecked]=useState(false);

    //listen to socket 
    useEffect(()=>{
        if(authChecked){
            listenToSocket(addNewMessage);
        }
        return ()=>{
            disconnectSocket();
        }
    },[authChecked]);

    useEffect(()=>{
        (async () => {
            setLoading(true);
            const res=await verifyUser();
            if (res){
                setUser(res);
            }else{
                setUser(null);
            }
            setAuthChecked(true);
            setLoading(false);
        })();
    },[]);

    return <AuthContext.Provider value={{user,setUser,authChecked}}>
        {children}
    </AuthContext.Provider>
}