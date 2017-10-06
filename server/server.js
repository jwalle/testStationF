'use strict';

const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
const moment = require('moment');
const helmet = require('helmet');
const jwt = require('jwt-simple');

let jwtauth = require('./jwtauth');

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

app.set('jwtTokenSecret', 'very-secret-value');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function simpleRooms() {
    let result = null;
        try {
            result = JSON.parse(fs.readFileSync('./rooms.json', function (err, data) {
                if (err) throw err;
                return data;
            }));
        }
        catch(e) {}
        return(result);
}

function getRooms() {
    return new Promise( function (resolve, error) {
        resolve(simpleRooms());
    })
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
        rooms.sort(compareRoomsASC);
    } else if (sortDir === 'DSC') {
        rooms.sort(compareRoomsDSC);
    }
    return rooms;
}

function hasThisEquip(filters, equips){
    let count = 0;
    if (filters.length === 0)
        return 1;
    equips.map( a => {
        filters.map(b => {
            if (a.name === b)
                count = count + 1;
        });
    });
    return (count > 0);
}

function filterEquip(rooms, filters) {
    return rooms.rooms.filter(function (a) {
        return hasThisEquip(filters, a.equipements);
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
    let rsvts = getReservation();
    if (time < moment().format('X'))
        return (true);
    if (simpleRooms().rooms[roomIndex]) {
        for (let key in rsvts) {
            if (rsvts.hasOwnProperty(key)) {
                let val = rsvts[key];
                if (val.roomIndex == roomIndex) {
                    if (val.time == time) {
                        return true;
                    }
                }
            }
        }
    }
    return(false);
}

app.post('/getRooms', bodyParser.json(), jwtauth, function (req, res) {
    getRooms()
        .then(response => {
            return filterEquip(response, req.body.filters)
        })
        .then(response => {
            return sortRooms(response, req.body.sortDir)
        })
        .then(response => {
            res.send(response)
        })
        .catch(error => console.log(error));
});

app.get('/getIsReserved/:roomIndex/:date', bodyParser.json(), jwtauth, function (req, res) {
    let roomIndex = req.params.roomIndex;
    let time = req.params.date;
    res.send(isReserved(roomIndex, time));
});


app.post('/setIsReserved', bodyParser.json(), jwtauth, function (req, res) {
    if (isReserved(req.body.roomIndex, req.body.date) === true)
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

app.get('/getLogin', function (req, res) {
    let expires = moment().add(7, 'days').valueOf();
    let token = jwt.encode(
        {
            iss: 'jwalle',
            exp: expires
        },
        app.get('jwtTokenSecret')
    );
    res.json({
        token : token,
        expires : expires,
        user : 'jwalle'
    });
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
