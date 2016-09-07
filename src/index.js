import express from 'express'
import socket from 'socket.io'
import http from 'http'

const app = express()
const server = http.Server(app)
const io = socket(server)

app.use(express.static(__dirname + './../static'))
app.use(express.static(__dirname + './../views'))
app.set('views', __dirname + './../views')
app.get('/', function(req, res){
    res.render('index')
})

io.of('/chat').on('connection', function(socket) {

    const address = socket.handshake.address.split('ffff:')[1]
    const avatar = '/avatar/' + address[address.length - 1] + '.jpg'

    socket.emit('user', {
        name: address,
        avatar: avatar
    })

    socket.on('say', function(data) {
        socket.broadcast.emit('message', {
            author: address,
            avatar: avatar,
            message: data
        })
    })
})

server.listen(4000)
console.log('app listen on 4000')
