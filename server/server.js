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

app.get('/getIsReserved/:roomIndex/:date', function (req, res) {
    let roomIndex = req.params.roomIndex;
    let time = req.params.date;
    let data = JSON.parse(fs.readFileSync('./rooms.json', function (err, data) {
        if (err) throw err;
        return data;
    }));
    if (data.rooms[roomIndex]) {
        res.send('false'); // if room is free
    } else {
        res.send('true'); //true
    }
});

app.post('/setIsReserved', function (req, res) {
    // get IS RESERVED
    // console.log(req.body);
    // return;
    fs.readFile('database/reservation.json', 'utf8', function (err, data) {
        if (err) throw err;
        let obj;
        if (!data)
        {
            obj = { reservation: [] }
        } else {
            obj = JSON.parse(data);
        }
            obj.reservation.push({
                roomIndex: req.body.roomIndex,
                time: req.body.date,
                user: 'jwalle'
            });
            let json = JSON.stringify(obj);
            fs.writeFileSync('database/reservation.json', json, 'utf8');
        res.send('true');
    });
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
