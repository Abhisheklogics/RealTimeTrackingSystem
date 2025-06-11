import dotenv from 'dotenv'
import express from 'express'
 import http from 'http'
import { fileURLToPath } from 'url'
import path from 'path'
 import { Server } from 'socket.io'
 const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)  
 let app = express()
 let server = http.createServer(app)
 let io=new Server(server)


dotenv.config({
    path:'./env'
})

 app.set('view engine',"ejs")
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection',(socket)=>{
  // ye jab chalenga jab  pehli baar koi user url ko khol ke ayega
console.log(socket.id)

socket.on('send-location',(data)=>{
  // send all connected users location
  io.emit('location-send',{id:socket.id,...data})
})

socket.on('disconnect',()=>{
  // send the socketid  al connected users 
  io.emit('user-disconnected',socket.id)
})
})
 app.get('/',(req,res)=>{
   res.render('index')
 })
 let Port=process.env.PORT || 10000
 server.listen(Port,()=>{
    console.log(`Server is Running at ${Port}`)
 })