const {MongoClient} = require('mongodb');
const dotenv = require('dotenv')
dotenv.config();

let dbConnection
let uri = process.env.MONGO_URL

module.exports = {
    connectToDb: (cb)=>{
        MongoClient.connect(uri).then((client)=>{
            dbConnection = client.db();
            return cb();
        }).catch(err=>{
            console.log(err)
            return cb(err)
        })
    },
    getDb:()=> dbConnection
}