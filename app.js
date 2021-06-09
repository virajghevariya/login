const path = require('path');
const colors = require('colors');
const express = require("express");
const http = require('http');
const dotenv = require("dotenv");
const router = require("./routes")
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
// const session = require("express-session");
const passport = require('passport');
require("./config/passport")(passport);
const hbs = require('hbs');

// Load env var
dotenv.config({ path: "./config/config.env" });

const server = http.createServer(app);


const PORT = process.env.PORT || 5600

server.listen(process.env.PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port: ${process.env.PORT}`.blue.inverse));


const io = require('socket.io')(server);

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// Connect to Database
connectDB();

//BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//hbs
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, "/templates/views"));
hbs.registerPartials(path.join(__dirname, "/templates/partials"));

// Store socketId in set because it's unique
const socketConnected = new Set();

// Scoket Connection 
io.on('connection', onConnected);

function onConnected(socket) {
    console.log(socket.id);
    socketConnected.add(socket.id);

    io.emit('clients-total', socketConnected.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected: ', socket.id);
        socketConnected.delete(socket.id);
        io.emit('clients-total', socketConnected.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);        
    });
}

// //express session
// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

app.use(passport.initialize());
app.use(passport.session());


//Routes
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/users"));


