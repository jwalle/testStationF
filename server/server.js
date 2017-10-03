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

function getRooms() {
    return JSON.parse(fs.readFileSync('./rooms.json', function (err, data) {
        if (err) throw err;
        return data;
    }));
}

function getReservation() {
    return JSON.parse(fs.readFileSync('database/reservation.json', function (err, data) {
        if (err) throw err;
        return data;
    })).reservation;
}

function isReserved(roomIndex, time) {
    let rooms = getRooms();
    let rsvts = getReservation();

    if (rooms.rooms[roomIndex]) {
        for (let key in rsvts) {
            if (rsvts.hasOwnProperty(key)) {
                let val = rsvts[key];
                if (val.roomIndex == roomIndex) {
                    if (val.time == time) {
                        return('true');
                    }
                }
            }
        }
    }
    return('false');
}

app.get('/getIsReserved/:roomIndex/:date', function (req, res) {
    let roomIndex = req.params.roomIndex;
    let time = req.params.date;
    res.send(isReserved(roomIndex, time));
});

app.post('/setIsReserved', function (req, res) {
    if (isReserved(req.body.roomIndex, req.body.date) == 'true')
        return ;
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
