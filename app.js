const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const app = express();
const bodyParser = require('body-parser');
var mongo = require("./public/service.mongo");
const server = http.Server(app);
const io = socketio(server); // Attach socket.io to our server

app.use(express.static("public")); // Serve our static assets from /public
app.use(bodyParser.json()); // body parser to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

server.listen(80, () => console.log("server started"));

const mancala = require("mancala");

// ROUTING
// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const rooms = [];
const players = [];

let EmitRoomState = (room, pots, isFinishedInOwnMancala) => {
  var board = [];

  for (const pot in pots) {
    board.push(pot.stone_count);
  }

  io.to(room.id).emit('statechanged', { board: board });

  if (!isFinishedInOwnMancala)
    shiftTurn(room);

}
let handleRoomJoin = (room, player, playerIndex) => {

  room.sockets[playerIndex] = player;

  room.player_ids.push(playerIndex);

  player.join(room.id);

  player.emit("connected", { room_id: room.id, playerIndex: playerIndex });

  if (room.player_ids.length == 2) {
    room.state = new mancala.GameState(6, room.player_ids[0], room.player_ids[1]);
    io.to(room.id).emit('nextTurn', { next_turn_player_id: room.players[room.turn] });
  }

  let shiftTurn = (room) => {
    var nextTurn = !room.turn;
    io.to(room.id).emit('nextTurn', { next_turn_player_id: room.players[nextTurn] });

  }

  let handleGameOver = (room) => {
    player1_score = room.state.pots[6].stone_count;
    player2_score = room.state.pots[12].stone_count;
    io.to(room.id).emit('GameOver', {
      player1_id: room.player_ids[0],
      player1_score: player1_score,
      player2_id: room.player_ids[1],
      player2_score: player2_score
    });

  }

  let handleMove = (data) => {
    var room = rooms[data.room_id];

    if (room.state.isGameOver()) {
      handleGameOver(room);
      return;
    }

    if (!room.state.HasPlayerStonesToPlay(data.player_id)) {
      shiftTurn(room);
      return;
    }

    var isFinishedInOwnMancala = false;

    room.state.MoveStones(data.room_id, data.player_id, data.pot_id, isFinishedInOwnMancala);

    EmitRoomState(data.room_id, room.state.pots, isFinishedInOwnMancala);

  }

  // Handle a socket connection request from web client
  io.on('connection', function (player) {

    console.log(`io.on connection: ${player.id}`);

    // Find an available player number
    let playerIndex = players.length;


    var room;

    if (playerIndex % 2) {
      room = rooms[rooms.length - 1]

    } else {
      room = {
        id: uuid(),
        sockets: [],
        player_ids: [],
        turn: 0
      }
      rooms[room.id] = room;
    }

    handleRoomJoin(room, player, playerIndex);

    players[playerIndex] = player;

    player.on('move', function (data) {

      handleMove(data);

    });

    player.on('disconnect', function () {
      console.log(`Player ${playerIndex} Disconnected`);
      players[playerIndex] = null;
    });
  });

}
