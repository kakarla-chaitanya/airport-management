import { createContext, useContext, useState } from "react";
import { setToastSetter } from "../utils/toast";

interface MessageContextType {
  addNewMessage: (
    newMessage: string,
    options?: {
      backgroundColor?: string;
      color?: string;
      ttl?: number;
    }
  ) => void;
  addFormErrorMessage:(message:string)=>void;
}
const MessageContext=createContext<MessageContextType|undefined>(undefined);

export function useMessageContext(){
    const context=useContext(MessageContext);
    if (!context){
        throw new Error("useMessageContext must be used within an MessageProvider")
    }
    return context;
}

type MessageType={
    message:string,
    color?:string,
    backgroundColor?:string;
}

export function MessageProvider({children}:{ children: React.ReactNode }){
    
    const [messages,setMessages]=useState<MessageType[]>([]);

    function addNewMessage(newMessage:string,{
      backgroundColor,
      color,
      ttl=4000
    }:{
      backgroundColor?:string,
      color?:string,
      ttl?:number
    }={}){
      setMessages((prev)=>([...prev,{message:newMessage,color,backgroundColor}]));
      setTimeout(() => {
        setMessages((prev) => prev.slice(1));
      }, ttl);
    }

    setToastSetter(addNewMessage);

    function addFormErrorMessage(message:string){
      addNewMessage(message,{
        backgroundColor:"red",
        ttl:2000,
      });
    }
    
    return (<MessageContext.Provider value={{addNewMessage,addFormErrorMessage}}>
        {children}
        <div className="message-container">
          {messages.map((msg,id) => (
            <div key={id} className="message-popup" style={{
                ...(msg.backgroundColor&&{backgroundColor:msg.backgroundColor}),
                ...(msg.color&&{color:msg.color}),
            }}>
              {msg.message}
            </div>
          ))}
        </div>
    </MessageContext.Provider>);
}