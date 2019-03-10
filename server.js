const express=require("express");
const app=express();
const server=require("http").createServer(app);
const io=require("socket.io").listen(server).sockets;




app.get("/",function (req,res) {
    res.sendFile(__dirname+"/index.html");
});
let connectedUser=[];

io.on("connection",function (socket) {
   console.log("连接上了");
   let userName='';

   socket.on("login",(name,callback)=>{
       if(name.trim().lenghth===0){
           return;
       }
       callback(true);
       userName=name;
       connectedUser.push(userName);
       console.log(connectedUser);
       updateUserName();
   });

   socket.on("disconnect",()=>{
       console.log("user disconnected");
       connectedUser.splice(connectedUser.indexOf(userName),1);
       console.log(connectedUser);
       updateUserName();
   });

   function updateUserName(){
       io.emit("loadUser",connectedUser);
   }
});

const port=process.env.PORT || 5000;
server.listen(port,()=>console.log("server running on port 5000"))