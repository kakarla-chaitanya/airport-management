import { createContext, useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { getCSSVariable } from "../utils/get_css_variable";

type LoaderContextType=React.Dispatch<React.SetStateAction<boolean>>;
const LoaderContext=createContext<LoaderContextType|null>(null);

export function useLoaderContext(){
    const context=useContext(LoaderContext);
    if (!context){
        throw new Error("useLoaderContext must be used within a LoaderProvider");
    }
    return context;
}

export function LoaderProvider({children}:{children:React.ReactNode}){
    const [loading,setLoading]=useState<boolean>(false);
    const loaderColor=getCSSVariable("--loader-color");
    return <LoaderContext.Provider value={setLoading}>
        {children}
        {loading && <div className="loader">
            <ScaleLoader color={loaderColor} height={50} width={6} loading={loading}/>
        </div>}
    </LoaderContext.Provider>
}