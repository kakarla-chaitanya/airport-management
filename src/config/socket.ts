import { createServer } from "http";
import app from "./app";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const server=createServer(app);

const io=new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    }
});

io.on("connection",async (socket)=>{
    console.log(`connected to socket ${socket.id}`);

    socket.on("disconnect",()=>{
        console.log("Disconnected to Socket",socket.id);
    });
});

export {io};
export default server;