import { io } from "socket.io-client";

const socket=io(import.meta.env.VITE_API_URL,{
    withCredentials:true,
    transports: ["websocket"],
});

export default socket;

function connectSocket(){
    if (!socket.connected){
        socket.connect();
        socket.on("connect",()=>{
            console.log("connected to socket "+socket.id);
        })
    }
}

export function listenToSocket(addNewMessage: (newMessage: string, options?: {
        backgroundColor?: string | undefined;
        color?: string | undefined;
        ttl?: number | undefined;
    } | undefined) => void
){

    connectSocket();

    const simpleEvents = ["auth-event", "flight-event", "baggage-event"];

    simpleEvents.forEach(eventName => {
      socket.on(eventName, (message) => {
        console.log("eventName",eventName);
        addNewMessage(message);
      });
    });

    socket.on("ops-event",(message)=>{
        addNewMessage(message,{backgroundColor:"red"});
    });
}
export function disconnectSocket(){
    if (socket.connected){
        socket.disconnect();
        socket.on("disconnect", () => {
          console.log("Socket disconnected: "+socket.id);
        });
    }
}
