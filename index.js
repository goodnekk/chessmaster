var express = require('express');
var app = express();

var posts = [];

var validLetters = /[ABCDEFGH]/;
var validNumbers = /[12345678]/;


app.use(express.static('static'));

app.get('/post/:text', function (req, res) {
    var value = req.params.text.toUpperCase();


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

    for(var i in posts){
        if(posts[i].value == value){
            posts[i].count++;
            res.send('add');
            return;
        }
    }

    posts.push({
        count: 1,
        value: req.params.text.toUpperCase()
    });

    res.send('add');
});

app.get('/list', function (req, res) {
    res.send(JSON.stringify(posts));
});

app.get('/clear', function(req, res){
    posts = [];
    res.send('clear');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
