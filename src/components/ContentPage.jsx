import React from 'react';
import axios from 'axios';
import ReservationBox from './reservationBox.jsx';

let sortType = {
    ASC: 'ASC',
    DSC: 'DSC'
};

class ContentPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rooms : [],
            room : '',
            roomIndex: 0,
            user : 'julien',
            isOpen: false,
            sortDir: '',
            filters: []
        };
        this.getRooms = this.getRooms.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
    }

    componentWillMount() {
        this.getRooms();
        this.getFilters();
    }

    reserveSortDir(sortDir) {
    return sortDir === sortType.DSC ? sortType.ASC : sortType.DSC;
}

    toggleModal(index, room) {
        this.setState({
            roomIndex: index,
            room: room,
            isOpen: !this.state.isOpen
        });
    }

    getRooms() {
        let self = this;
        axios
            .get('/getRooms')
            .then(res => self.setState({
                rooms : res.data.rooms
            }))
            .catch(err => console.log('getRooms error : ' + err));
    }

    removeFilter(filter) {
        let self = this;
        axios
            .get('/removeFilter/' + filter)
            .then(res => self.setState({
                rooms : res.data.rooms
            }))
            .catch(err => console.log('removeFilter error : ' + err));
    }

    getFilters() {
        let self = this;
        axios
            .get('/getFilters')
            .then(res => {console.log(res); self.setState({
                filters : res.data
            })})
            .catch(err => console.log('getFilter error : ' + err));
    }

    addFilter(filter) {
        let self = this;
        axios
            .get('/addFilter/' + filter)
            .then(res => self.setState({
                rooms : res.data.rooms
            }))
            .catch(err => console.log('addFilter error : ' + err));
    }

    sortRooms() {
        let self = this;
        let sortDir = '';
        if (!this.state.sortDir) {
            sortDir = 'ASC';
        } else {
            sortDir = this.reserveSortDir(this.state.sortDir);
        }
        axios
            .get('/sortRooms/' + sortDir)
            .then(res => self.setState({
                rooms : res.data.rooms
            }))
            .catch(err => console.log('sortRooms error : ' + err));
        this.setState({sortDir: sortDir});
    }

    render() {
        let self = this;
        let listEquip = ({room}) => room.equipements.map(function (equip, index) {
           return (<span
               className="equip btn btn-primary"
               key={index}
               onClick={(e) => {self.addFilter(equip.name); e.stopPropagation();}}>
               {equip.name}
                    </span>)
        });
        let listFilters = this.state.filters.map(function (filter, index) {
            return (
                <button className="btn btn-info" key={index} onClick={() => self.removeFilter(filter)}>
                    {filter}
                </button>
            )
        });

        let listRooms = this.state.rooms.map(function (room, index) {
            return (
                <tr key={index} value={room} onClick={() => { this.toggleModal(index, room);}}>
                    <td> {room.name} </td>
                    <td> {room.description} </td>
                    <td>  {listEquip({room})} </td>
                    <td>  {room.capacity} </td>
                </tr>
            );}.bind(this)
        );
        let sortDir = this.state.sortDir;
        return (
            <div className="container">
                <div className="row">
                        <div className="">
                            <button className="btn" onClick={() => this.sortRooms()}>
                                Triez par place
                            </button>
                            {listFilters}
                        <table className="table table-hover table-striped">
                            <thead className="thead-inverse">
                            <tr>
                                <th style={{width:200}}>name</th>
                                <th style={{width:200}}>Description</th>
                                <th>equipements</th>
                                <th style={{width:70}} onClick={() => this.sortRooms()}>
                                    place {sortDir ? (sortDir === sortType.ASC ? '↓' : '↑') : ''}
                                    </th>
                            </tr>
                            </thead>
                            <tbody>
                                {listRooms}
                            </tbody>
                        </table>
                    </div>
                </div>
                <ReservationBox
                    show={this.state.isOpen}
                    room={this.state.room}
                    roomIndex={this.state.roomIndex}
                    onClose={this.toggleModal}>
                </ReservationBox>
            </div>
    );
  }
}

export default ContentPage;
