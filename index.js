const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const route = require('./route.js');
const {addUser, findUser, getRoomUsers, removeUser} = require("./users");
const {SMITH} = require("./constants");

const app = express();

app.use(cors({origin: "*"}));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

io.on('connection', (socket) => {

    socket.on('join', ({name, room}) => {

        socket.join(room);

        const {user, isExist} = addUser({name, room});
        const userMessage = isExist ? `${user.name} you come again,fuuuuck...` : `Hi,${user.name}, and fuck you...)`;

        socket.emit('message', {
            data: {
                user: {
                    name: SMITH,
                },
                message: userMessage,
            }
        });
        socket.broadcast.to(user.room).emit('message', {
            data: {
                user: {
                    name: SMITH,
                },
                message: `${user.name} has fucking join`,
            }
        });
        io.to(user.room).emit('joinRoom', {
            data: {
                users: getRoomUsers(user.room)
            },
        });
    });

    socket.on('sendMessage', ({message, params}) => {
        const user = findUser(params);
        if (user) {
            io.to(user.room).emit('message', {data: {user, message}})
        }
    });

    socket.on('leftRoom', ({params}) => {
        const user = removeUser(params);
        if (user) {
            const {room, name} = user;
            io.to(room).emit('message', {
                data: {
                    user: {name: SMITH},
                    message: `${name} has left, and we are all happy now...`
                }
            });
            io.to(room).emit('joinRoom', {
                data: {
                    users: getRoomUsers(room)
                },
            });
        }
    });

    io.on('disconnect', () => {
        console.log('Disconnected this shit!!!');
    });

});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});