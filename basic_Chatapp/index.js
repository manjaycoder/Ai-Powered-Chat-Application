// 1. import packages
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'


// 2. Create Instance & Make Servver
const app=express()
const server=http.createServer(app)
const io=new Server(server)

//3. Serve static Files
app.use(express.static('public'))


//5. Create Connections
io.on('connection',(socket)=>{
  console.log("User connected successfully ✅")
  socket.on('message',(msg)=>{
    io.emit('message',msg)
    console.log(msg)
  })
  socket.on('disconnect',()=>{
    console.log('User Disconnected ❌')
  })
})


//6. Run Server

server.listen(3000,()=>{
  console.log(`Listing on on :3000`)
})
