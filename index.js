var express = require('express');
var app = express();

var posts = [];
var lastmoves = [];
var move = "Wit";


var validLetters = /[ABCDEFGH]/;
var validNumbers = /[12345678]/;


var timerSize = 60;
var timer = timerSize;

setInterval(function(){
    if(posts.length>0 && timer > 0){
        timer--;
    }
}, 1000);

app.use(express.static('static'));

//post a new move vote
app.get('/post/:text', function (req, res) {
    var value = req.params.text.toUpperCase();

    /*
    //check validity
    var firstLetter = value[0];
    var firstNumber = value[1];
    var secondLetter = value[3];
    var secondNumber = value[4];

    if(firstLetter.search(validLetters)!==0) {
        res.send('fail');
        return;
    }
    if(firstNumber.search(validNumbers)!==0) {
        res.send('fail');
        return;
    }

    if(secondLetter.search(validLetters)!==0) {
        res.send('fail');
        return;
    }

    if(secondNumber.search(validNumbers)!==0) {
        res.send('fail');
        return;
    }

    value = firstLetter + firstNumber + " " + secondLetter + secondNumber;
    */
    //if existing move add to count
    var update = false;
    for(var i in posts){
        if(posts[i].value == value){
            posts[i].count++;
            update = true;
            break;
        }
    }

    //if non existing move add to list
    if(update===false){
        posts.push({
            count: 1,
            value: req.params.text.toUpperCase()
        });
    }

    //sort the posts so most popular is on top
    posts = posts.sort(function(a,b){
        if(a.count<b.count) {
            return 1;
        }
        if(a.count>b.count) {
            return -1;
        }
        return 0;
    });

    res.send('add');
});

app.get('/drop/:id', function(req, res){
    if(posts[req.params.id]){
        posts.splice(req.params.id, 1);
    }
    res.json("okay");
});

//list all the moves
app.get('/list', function (req, res) {
    res.json({
        posts: posts,
        lastmoves: lastmoves,
        move: move,
        timer: timer,
        timerSize: timerSize
    });
});


app.get('/round', function(req, res){
    if(posts.length>0){
        //add to lastmoves
        lastmoves.push({
            move: move,
            post: posts[0]
        });

        //clear votes list
        posts = [];

        //switch move
        if(move==="Wit") {
            move="Zwart";
        } else {
            move="Wit";
        }

        //reset timer
        timer = timerSize;
    }
    res.json('clear');
});

app.get('/restart', function(req, res){
    move = "Wit";
    lastmoves = [];
    posts = [];
});

app.get('/timersize/:size', function(req, res){
    timerSize = parseInt(req.params.size);
    timer = timerSize;
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
