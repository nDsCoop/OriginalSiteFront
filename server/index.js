
const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const cors_proxy = require('cors-anywhere');
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const shortid = require("shortid");
const Pusher = require('pusher');
const bodyParser = require("body-parser");
const socketManager = require("./socketManager");

// app config
const app = require('express')();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

//socket config
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3231
io.on('connection', socketManager)

const pusher = new Pusher({
  appId: '1083128',
  key: '02b865ac879689d71e48',
  secret: 'cfcc2b6d2fbee120d215',
  cluster: 'ap1',
  encrypted: true
});

const db = mongoose.connection;
db.once('open', () => {
  console.log("MongoBD connected");

  const msgCollection = db.collection("messages");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === 'insert') {
      const messageDetails = change.fullDocument;
      pusher.trigger('messages', 'inserted', {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received
      });
    } else {
      console.log('Err triggering Pusher');
    }
  });
 });

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 minutes 20 request
  max: 50 // limit each IP to 100 requests per windowMs
});

//  apply to all requests

app.use(limiter);

var allowedOrigins = ['http://localhost:5000'];

// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin 
//     // (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       var msg = 'The CORS policy for this site does not ' +
//         'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));
// app.options("*", cors());


// DB connect
const connection_url = "mongodb+srv://admin:pdWd0EPq2gekrPLc@cluster0.xlafo.mongodb.net/ndsApp?retryWrites=true&w=majority"
mongoose.connect(connection_url,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})

 //structeion message app3
 const AppMess =  mongoose.model (
  "messages",
  new mongoose.Schema({
  _id: {type: String, default: shortid.generate},
  message: String,
  name: String,
  timestamp: String,
  received: Boolean
})
);
 


//get, post method app3 server
app1.get("/messages", async (req, res) => {
  res.status(200).send("Welcome to api why i dont post some thing in here")
});

app.get('/messages/sync', async (req, res) => {
  AppMess.find((err, data) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
app.post("/messages/new", async (req, res) => {
  const newAppMess = req.body

  AppMess.create(newAppMess, (err, data) =>{
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});



//app2 server
app1.get('/song', async (req, res) =>
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


app.listen(port, () => console.log(`Server is listening on port ${port}.`));
