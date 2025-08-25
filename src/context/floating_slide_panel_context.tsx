import { createContext, useContext, useState } from "react";
import FloatingSlidePanel from "../pages/home/components/floating_slide_panel";

type FloatingSlidePanelContextProps={
    setOpen:React.Dispatch<React.SetStateAction<boolean>>,
    setChild:React.Dispatch<React.SetStateAction<React.ReactNode>>,
}

const FloatingSlidePanelContext=createContext<FloatingSlidePanelContextProps|null>(null);

export function useFloatingslidePanelContext(){
    const context=useContext(FloatingSlidePanelContext);
    if (!context){
        throw new Error("You can access Floating Slide Panel inside it children only");
    }
    return context;
}

export function FloatingSlidePanelProvider({children}:{children:React.ReactNode}){
    const [isOpen,setOpen]=useState(false);
    const [child,setChild]=useState<React.ReactNode|null>(null);
    return <FloatingSlidePanelContext.Provider value={{setOpen,setChild}}>
        {children}
        {
            child &&<FloatingSlidePanel isOpen={isOpen} onClose={()=>{
                setOpen(false);
                setChild(null);
            }} children={child} />
        }
    </FloatingSlidePanelContext.Provider>
}