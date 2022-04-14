const express = require("express");
const bodyParser = require("body-parser");
const req = require("express/lib/request");
const res = require("express/lib/response");
const hbs = require("hbs");

const sha256 = require("sha256");

class Block{
    constructor(index, data, prevHash){
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.prevHash = prevHash;
        this.currHash = this.mineHash();
    }
    // POW env
    mineHash() {
        var nonce = 0;
        var hash = "";

        while(!this.verifyHash(hash)){
            hash = sha256(nonce + this.data);
            nonce += 1
        }

    return hash;
    }

    verifyHash(hash){
        return hash.startsWith("0" *3)
    }
}

//Blockchain Data Structure
class Blockchain{
    constructor(){
        console.log("Blockchain is getting created!!")
        this.blockchain = [this.createGenesisBlock()]
    }

    createGenesisBlock(){
        return new Block(0, "Genesis Block data", 0)
    }

    addNewBlock(data) {
        var block = new Block(this.getLastIndex() + 1, data, this.getPrevHash())
        this.blockchain.push(block)
    }

    getLastIndex() {
        return this.blockchain.at(-1).index
    }

    getPrevHash() {
        return this.blockchain.at(-1).currHash
    }
}

var chain = new Blockchain();
chain.addNewBlock("First Block!!")
chain.addNewBlock("Second Block!!")
//console.log(chain)




//express code
var app = express();
//calling bodyParser
app.use(bodyParser.json({type: "*"}))
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine","hbs");
app.set("views", __dirname);

app.get("/", (req, res) => {
    //res.send("Hello World!!")
    res.render("index", {blockchain: chain.blockchain})
});

app.post("/", (req,res) => {
    chain.addNewBlock(req.body.data)
    res.render('index', {blockchain: chain.blockchain})
})

app.listen(3000, () => {
    console.log("This port is up and running. Connected to http://localhost:3000");
})

