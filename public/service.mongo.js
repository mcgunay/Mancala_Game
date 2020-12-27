var mongo = require("mongodb").MongoClient;
const url = 'mongodb+srv://mongo_user:'+'Mc19901990*'+'@blograpsodo-tlgvr.mongodb.net/test?retryWrites=true&w=majority';
let count = 0;
var _db

// connectToServer =  function( callback ) {
//     mongo.connect( url,  { useNewUrlParser: true }, function( err, client ) {
//       _db  = client.db('MyBlog');
//       return callback( err );
//     } );
//   }

// getDb =  function() {
//     return _db;
//   }

//   const connectDB = async (callback) => {
//     try {
//         mongo.connect(url, (err, client) => {
//             _db =  client.db('MyBlog');
//             return callback(err)
//         })
//     } catch (e) {
//         throw e
//     }
// }

connectDB =  function( callback ) {
        mongo.connect( url,  { useNewUrlParser: true }, function( err, client ) {
          _db  = client.db('MyBlog');
          return callback( err ,client);
        } );
      }

//   const connectDB = (async (callback) => {
    
//     let client = await mongo.connect(url, { useNewUrlParser: true });

//      if(client == null)
//       throw "Mongo Connection Failed";
//     _db =  client.db('MyBlog');
//     app.emit('ready');

// })().catch( err => console.log(err));

const getDB = () => _db

const disconnectDB = () => _db.close()

module.exports = { connectDB, getDB, disconnectDB }