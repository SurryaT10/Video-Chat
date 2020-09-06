var express=require('express')
var app=express();
var server=require('http').Server(app)
var io=require('socket.io')(server)
var cors=require('cors')
app.use(cors())
app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.send('captain JACKSPARROW...[ ^._.^ ]')
})
io.on('connection',(connect)=>{
    connect.on('chat',({roomId,name,message})=>{
        io.emit('chat',{roomId,name,message})
    });
    connect.on("disconnect",(loseconnection)=>{
        io.emit('disconnect',{lose:loseconnection})
    })
})
server.listen(9000,(err,res)=>{
    if(err)throw err;
    console.log("server is running at port",9000)
})