var express = require('express');
var app = express();

app.get('/:text', function (req, res) {
    console.log(req.params.text);
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
