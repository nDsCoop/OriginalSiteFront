
const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const cors_proxy = require('cors-anywhere');
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const path = require('path');
const handlebars = require('express-handlebars');
const handlebar = require('handlebars');
var fs = require('fs');
// const Pusher = require('pusher');
const io = require('socket.io')({
  path: '/io/webrtc'
});
const rooms = {};
const messages = {};


// app config

const app = express();
const port = process.env.PORT || 9150
app.use(express.json());
app.disable('x-powered-by');
require('dotenv').config();

//socket config
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);


// io.on('connection', socketManager);

// const pusher = new Pusher({
//   appId: '1083128',
//   key: '02b865ac879689d71e48',
//   secret: 'cfcc2b6d2fbee120d215',
//   cluster: 'ap1',
//   encrypted: true
// });

const db = mongoose.connection;
db.once('open', () => {
  console.log("MongoBD connected");


  const msgCollection = db.collection("feedbacks");
  const changeStream = msgCollection.watch();

  // changeStream.on("change", (change) => {
  //   console.log(change);
  //   if (change.operationType === 'insert') {
  //     const messageDetails = change.fullDocument;
  //     pusher.trigger('messages', 'inserted', {
  //       name: messageDetails.name,
  //       message: messageDetails.message,
  //       timestamp: messageDetails.timestamp,
  //       received: messageDetails.received
  //     });
  //   } else {
  //     console.log('Err triggering Pusher');
  //   }
  // });
 });

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 minutes 20 request
  max: 20 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
//  apply to all requests
var allowedOrigins = ['http://localhost:3000', 'http://localhost:9150'];
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.options("*", cors());


// DB connect
const connection_url = process.env.MongoDb
mongoose.connect(connection_url,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})

//Email config
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
    port: 587,
    secure: false,
  auth: {
    user: process.env.Email,
    pass: process.env.Password,
  }
});



// verifying the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages!");
  }
});

//  //structeion message app3
 const Feedbacks =  mongoose.model (
  "feedbacks",
  new mongoose.Schema({
  _id: {type: String, default: shortid.generate},
  name: String,
  email: String,
  message: String,
  token: String,
  timestamp: String,
})
);
const Clients =  mongoose.model (
  "clients",
  new mongoose.Schema({
  _id: {type: String, default: shortid.generate},
  ip: String,
  timestamp: String,
})
);
 


//get, post method app3 server
app.get("/ndsapi/message", async (req, res) => {
  res.status(200).send("Welcome to api why i dont post some thing in here")
});



// app.get('/messages/sync', async (req, res) => {
//   AppMess.find((err, data) => {
//     if(err) {
//       res.status(500).send(err);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });
app.post("/ndsapi/client", async (req, res) => {
  const newAppMess = req.body

  Clients.create(newAppMess, (err, data) =>{
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/ndsapi/feedback", async (req, res) => {
  const newAppMess = req.body

  Feedbacks.create(newAppMess, (err, data) =>{
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//mail in browser
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
  layoutsDir: __dirname + '/views/layouts',
}));

app.get('/announce/welcome', (req, res) => {
  //Using the index.hbs file instead of planB
  res.render('main', {layout: 'index'});});

//nDn Announce
app.post('/ndsapi/announce/welcome', (req, res, next) => {

  const filePath = path.join(__dirname, '../server/views/layouts/index.handlebars');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebar.compile(source);

  const sender = req.body.sender || 'nds.tphcm@gmail.com';
  const receiver = req.body.email;
  const name = req.body.name;
  const htmlToSend = template({name:name});

  let mail = {
      from: sender, 
      to: receiver, 
      subject: 'Welcome to nDsApp',
      html: htmlToSend,
    }
   
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      });
      console.log(err)
    } else {
      res.json({
       status: 'success'
      });
      console.log("Successful sent mail! ")
    }
  })
})

app.post('/ndsapi/announce/changeinfouser', (req, res, next) =>{

  const filePath = path.join(__dirname, '../server/views/layouts/cpanounnce.handlebars');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebar.compile(source);

  const sender = req.body.sender || 'nds.tphcm@gmail.com';
  const receiver = req.body.email;
  const name = req.body.name;
  const ip = req.body.ip;
  const country = req.body.country;
  const city = req.body.city;
  const htmlToSend = template({name: name, ip: ip, country: country, city: city});

  let mail = {
    from: sender, 
    to: receiver, 
    subject: 'Change Password Of Account',
    html: htmlToSend,
  }
 
transporter.sendMail(mail, (err, data) => {
  if (err) {
    res.json({
      status: 'fail'
    });
    console.log(err)
  } else {
    res.json({
     status: 'success'
    });
    console.log("Successful sent mail! ")
  }
})

})

//Send Mail
app.post('/ndsapi/mail', (req, res, next) => {
  // const name = req.body.name;
  const sender = req.body.email;
  const receiver = req.body.receiver || 'nds.tphcm@gmail.com';
  const message = req.body.message;
  const token = req.body.token;
  const content = `Feedback from Email Address: ${sender} \n Content: ${message} \n \n Get Token Form Page Feedback: ${token}`;

  let mail = {
      from: sender, 
      to: receiver, 
      subject: 'Feedback From User',
      content: content,
    }
   
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      });
      console.log(err)
    } else {
      res.json({
       status: 'success'
      });
      console.log("Successful sent mail! ")
    }
  })
})



 //app2 server
 app.get('/song', async (req, res) =>
 ytdl
   .getInfo(req.query.id)
   .then(info => {
     const audioFormats = ytdl.filterFormats(info.formats, 'audioonly')
     res.set('Cache-Control', 'public, max-age=20000'); //6hrs aprox
     res.json(audioFormats[1].url)
   })
   .catch(err => res.status(400).json(err.message))
)

let proxy = cors_proxy.createServer({
 originWhitelist: [], // Allow all origins
 requireHeaders: [], // Do not require any headers.
 removeHeaders: [] // Do not remove any headers.
});

app.get('/proxy/:proxyUrl*', (req, res) => {
 req.url = req.url.replace('/proxy/', '/'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
 proxy.emit('request', req, res);
});
// app.listen(port, () => console.log(`Server is listening on port ${port}.`));
 const server = app.listen(port, () => console.log(`Server is listening on port ${port}.`));

io.listen(server)

// default namespace
io.on('connection', socket => {
  console.log('connected')
})

// https://www.tutorialspoint.com/socket.io/socket.io_namespaces.htm
const peers = io.of('/webrtcPeer')

// keep a reference of all socket connections
// let connectedPeers = new Map()

peers.on('connection', socket => {

  const room = socket.handshake.query.room
  const user = socket.handshake.query.user
  console.log(user);
  const userO = user.substring(25)
  if(userO.length){
    rooms[room] = rooms[room] && rooms[room].set(socket.id, socket) || (new Map()).set(socket.id, socket)
  messages[room] = messages[room] || []

  // connectedPeers.set(socket.id, socket)

  console.log(socket.id, room)
  socket.emit('connection-success', {
    success: socket.id,
    peerCount: rooms[room].size,
    messages: messages[room],
  })

  // const broadcast = () => socket.broadcast.emit('joined-peers', {
  //   peerCount: connectedPeers.size,
  // })
  const broadcast = () => {
    const _connectedPeers = rooms[room]

    for (const [socketID, _socket] of _connectedPeers.entries()) {
      // if (socketID !== socket.id) {
        _socket.emit('joined-peers', {
          peerCount: rooms[room].size, //connectedPeers.size,
        })
      // }
    }
  }
  broadcast()

  // const disconnectedPeer = (socketID) => socket.broadcast.emit('peer-disconnected', {
  //   peerCount: connectedPeers.size,
  //   socketID: socketID
  // })
  const disconnectedPeer = (socketID) => {
    const _connectedPeers = rooms[room]
    for (const [_socketID, _socket] of _connectedPeers.entries()) {
        _socket.emit('peer-disconnected', {
          peerCount: rooms[room].size,
          socketID
        })
    }
  }

  socket.on('new-message', (data) => {
    console.log('new-message', JSON.parse(data.payload))

    messages[room] = [...messages[room], JSON.parse(data.payload)]
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
    // connectedPeers.delete(socket.id)
    rooms[room].delete(socket.id)
    messages[room] = rooms[room].size === 0 ? null : messages[room]
    disconnectedPeer(socket.id)
  })

  // ************************************* //
  // NOT REQUIRED
  // ************************************* //
  socket.on('socket-to-disconnect', (socketIDToDisconnect) => {
    console.log('disconnected')
    // connectedPeers.delete(socket.id)
    rooms[room].delete(socketIDToDisconnect)
    messages[room] = rooms[room].size === 0 ? null : messages[room]
    disconnectedPeer(socketIDToDisconnect)
  })

  socket.on('onlinePeers', (data) => {
    const _connectedPeers = rooms[room]
    for (const [socketID, _socket] of _connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID.local) {
        console.log('online-peer', data.socketID, socketID)
        socket.emit('online-peer', socketID)
      }
    }
  })

  socket.on('offer', data => {
    console.log(data)
    const _connectedPeers = rooms[room]
    for (const [socketID, socket] of _connectedPeers.entries()) {
      // don't send to self
      if (socketID === data.socketID.remote) {
        // console.log('Offer', socketID, data.socketID, data.payload.type)
        socket.emit('offer', {
            sdp: data.payload,
            socketID: data.socketID.local,
          }
        )
      }
    }
  })

  socket.on('answer', (data) => {
    console.log(data)
    const _connectedPeers = rooms[room]
    for (const [socketID, socket] of _connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        console.log('Answer', socketID, data.socketID, data.payload.type)
        socket.emit('answer', {
            sdp: data.payload,
            socketID: data.socketID.local,
          }
        )
      }
    }
  })

  // socket.on('offerOrAnswer', (data) => {
  //   // send to the other peer(s) if any
  //   for (const [socketID, socket] of connectedPeers.entries()) {
  //     // don't send to self
  //     if (socketID !== data.socketID) {
  //       console.log(socketID, data.payload.type)
  //       socket.emit('offerOrAnswer', data.payload)
  //     }
  //   }
  // })

  socket.on('candidate', (data) => {
    console.log(data)
    const _connectedPeers = rooms[room]
    // send candidate to the other peer(s) if any
    for (const [socketID, socket] of _connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        socket.emit('candidate', {
          candidate: data.payload,
          socketID: data.socketID.local
        })
      }
    }
  })
  } 
})