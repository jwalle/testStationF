const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs');

/* eslint-disable no-console */

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join( __dirname, '../public')));

app.get('/getRooms', function (req, res) {
    fs.readFile('./rooms.json', function (err, data) {
        if (err) throw err;
        res.send(data);
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

});

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
