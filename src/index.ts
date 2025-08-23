import dotenv from "dotenv";
dotenv.config();

import "./config/redis";
import { connectDB, disconnectDB } from "./config/db";
import { connectKafka, disconnectKafka } from "./config/kafka";
import server from "./config/socket";



(async ()=>{
  let port=process.env.PORT;
  if (!port){
      throw new Error("Invalid Port number");
  }

  await connectDB();
  await connectKafka();

  server.listen(Number(port),()=>{
      console.log(`API running on port :- ${port}`);
  });

})();

async function shutDown() {
    try{
        await disconnectDB();
        await disconnectKafka();
    }catch(e){
        console.log(e);
    }

    if (server){
      server.close(()=>{
          console.log("Server Closed");
          process.exit(0);
      })
    }
}

process.on('SIGINT', shutDown);  // Ctrl+C
process.on('SIGTERM', shutDown); // kill command or from process manager

process.once('SIGUSR2', () => {
  shutDown().then(() => process.kill(process.pid, 'SIGUSR2')); //for nodemon
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutDown();
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  shutDown();
});