'use strict';

const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
const moment = require('moment');
const helmet = require('helmet');

/* eslint-disable no-console */

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join( __dirname, '../public')));

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getRooms', function (req, res) {
    res.send(getRooms());
});

let myFilters = [];

function getRooms() {
    let result = null;
    try {
        result = JSON.parse(fs.readFileSync('./rooms.json', function (err, data) {
            if (err) throw err;
            return data;
        }));
    }
    catch(e) { } //TODO
    return result;
}

function compareRoomsASC(a, b) {
    if (a.capacity < b.capacity)
        return -1;
    if (a.capacity > b.capacity)
        return 1;
    return 0;
}

function compareRoomsDSC(a, b) {
    if (a.capacity < b.capacity)
        return 1;
    if (a.capacity > b.capacity)
        return -1;
    return 0;
}

function sortRooms(rooms, sortDir) {
    if (sortDir === 'ASC') {
        rooms.rooms.sort(compareRoomsASC);
    } else {
        rooms.rooms.sort(compareRoomsDSC);
    }
    return rooms;
}

function addFilter(filter)
{
    myFilters.indexOf(filter) === -1 ? myFilters.push(filter) : null;
}

function removeFilter(filter) {
    myFilters = myFilters.filter(entry => entry != filter);
}

function filterEquip(filterEquip) {
    let rooms = getRooms();

    return rooms.rooms.filter(function (a) {
        let res = a.equipements.map(b => {
            return (filterEquip.indexOf(b.name) > -1);
        });
        return res.indexOf(true) > -1;
    });
}

function getReservation() {
    let result = null;
    try {
            result = JSON.parse(fs.readFileSync('database/reservation.json', function (err, data) {
              if (err) throw err;
                 return data;
            })).reservation;
        }
    catch(e) {

    }
    return result;
}

function isReserved(roomIndex, time) {
    let rooms = getRooms();
    let rsvts = getReservation();
    let cTime = moment().format('X');
    if (time < cTime)
        return ('true');
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

app.get('/addFilter/:filter', function (req, res) {
    addFilter(req.params.filter);
    res.send(getRooms());
});

app.get('/removeFilter/:filter', function (req, res) {
    removeFilter(req.params.filter);
    res.send(getRooms());
});

app.get('/getFilters', function (req, res) {
    res.send(myFilters);
});

app.post('/filterRooms', function (req, res) {
    res.send(filterEquip(req.body.filteredEquip));
});

app.get('/sortRooms/:sortDir', function (req, res) {
    let rooms = getRooms();
    res.send(sortRooms(rooms, req.params.sortDir));
});

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
