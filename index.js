//1. package
import express from "express";
import http from 'http'
import { fileURLToPath } from "url";
import { dirname,join } from "node:path";
import { Server } from "socket.io";
import { log } from "node:console";



//2. Instance
const app=express();
const server=http.createServer(app)
const io=new Server(server)

//3. Serving html file
const __dirname=dirname(fileURLToPath(import.meta.url))
app.get("/",(req,res)=>{
  res.sendFile(join(__dirname,'index.html'))
})



//4. define a connection event handler
io.on('connection',(client)=>{
  console.log("Connected user to (Server) ✅")
  //emit a message event to the client 
client.on('message',(message)=>{
  console.log(message);
  
})



  //handle disconnect 
  client.on("disconnect",()=>{
    console.log("Disconnect to (server) ❌")
  })
})
//5.start the server
const PORT=3000;
server.listen(PORT,()=>{
  console.log("SERVER running on port")
})
