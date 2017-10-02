const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');

/* eslint-disable no-console */

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join( __dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getRooms', function (req, res) {
    fs.readFile('./rooms.json', function (err, data) {
        if (err) throw err;
        res.send(data);
    });
});

app.get('/getIsReserved/:room/:date', function (req, res) {
    let room = req.params.room;
    let time = req.params.date;
    console.log(room, time);
        res.send('false');
    });
    // let options = {
    //   url: 'http://online.stationf.co/tests/rooms.json',
    //   json: true
    // };
    // request.get(options, function (error, response, body) {
    //     if (!error /* && response.statusCode === 200*/) {
    //         res.send(body);
    //     }
    //     else
    //         console.log('request error :', error)
    //
    //});




app.get('*', function (req, res) {
  res.sendFile(path.join( __dirname, '../public/index.html'));
});

app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Server listening : http://localhost:%s', port);
  }
});
