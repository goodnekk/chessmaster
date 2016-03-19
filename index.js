var express = require('express');
var app = express();

var posts = [];

app.get('/post/:text', function (req, res) {
    console.log(req.params.text);
    for(var i in posts){
        if(posts[i].value == req.params.text){
            posts[i].count++;
            res.send('++');
            return;
        }
    }

    posts.push({
        count: 1,
        value: req.params.text
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
