var http = require("http");
var express = require("express");
var ShareDB = require("sharedb");
var richText = require("rich-text");
var WebSocketJSONStream = require("@teamwork/websocket-json-stream");
var WebSocket = require("ws");

ShareDB.types.register(richText.type);
var share = new ShareDB();

createDoc(startServer);

function createDoc(callback) {
  var connection = share.connect();
  //can create docs on server start
  connection.createFetchQuery("editors", {}, {}, function (err, results) {
    if (err) {
      throw err;
    }
    callback();
  });
}

function startServer() {
  var app = express();
  app.use(express.static("static"));
  app.use(express.static("node_modules/quill/dist"));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({ server: server });
  wss.on("connection", function (ws) {
    var stream = new WebSocketJSONStream(ws);
    share.listen(stream);
  });

  server.listen(8080);
  console.log("Listening on http://localhost:8080");
}
