"use strict"
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const requestAPI = require('request');

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res) {
  res.send('index.html');
});

app.get('/registr', function(req, res) {
  res.send('registr.html');
})

app.get('/search(.html)?', function(req, res) {
  res.send(`search.html`);
});

app.post('/search/result', urlencodedParser, function(req, res) {
  if(!req.body) return res.sendStatus(400);

  const singer = req.body.singer;
  const song = req.body.song;
  requestAPI(`https://api.lyrics.ovh/v1/${singer}/${song}`, function (error, response, body) {

    let lyrics = ``;
    for (var variable in body) {
      lyrics += body[variable];
    }
    const reg = /[\n\r]/g;
    const text = lyrics.replace(reg,'<br>');
    res.render('searchResult.hbs', {
      singer: `${singer}`,
      lyrics: `${text}`
    });
  });
});



app.listen(3000);
console.log('app listened on http://localhost:3000');
