const express=require('express');
const http=require('http');
const socketio = require("socket.io");
const connect=require('./config/database-config');

const chat=require('./models/chat');

const app=express();
const server = http.createServer(app);
const io =  socketio(server);

io.on('connection', (socket) => {
    console.log('a user connected',socket.id);

    socket.on('join_room',(data)=>{
        socket.join(data.roomid,function(){
            console.log("Joined a Room") 
        });
    });

    socket.on('msg_send',async (data)=>{
        console.log(data);
        const newChat=await chat.create({
            content:data.msg,
            user:data.username,
            roomId:data.roomid
        });
        io.to(data.roomid).emit('msg_rcvd',data);
        //socket.emit('msg_rcvd',data);
        //socket.broadcast.emit('msg_rcvd',data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.to(data.roomid).emit('someone_typing');
    })

});


app.set('view engine','ejs');
app.use('/',express.static(__dirname+'/public'));

app.get('/chat/:roomid',async (req,res)=>{
    const chats=await chat.find({
        roomId:req.params.roomid
    }).select('content user');
    res.render('index',{
        name:'Srinu',
        id:req.params.roomid,
        chats:chats
    });
});

server.listen(3000,async ()=>{
    console.log(`Server started`);
    await connect();
    console.log("MongoDB connected");
});