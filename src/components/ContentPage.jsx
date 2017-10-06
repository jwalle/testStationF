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
        this.addFilter = this.addFilter.bind(this);
    }

    componentWillMount() {
        this.getRooms();
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
        let config = {
            withCredentials: true,
            headers: {'content-type': 'application/json'}
        };
        let self = this;
        axios
            .post('/getRooms', {
                filters: self.state.filters,
                sortDir : self.state.sortDir
            },config)
            .then(res => {self.setState({
                rooms : res.data
            })})
            .catch(err => console.log('getRooms error : ' + err));
    }

    removeFilter(filter) {
        let myFilters = this.state.filters;
        this.setState({
            filters : myFilters.filter(entry => entry !== filter
            )}, this.getRooms);
        this.forceUpdate();
    }

    addFilter(filter) {
        let myFilters = this.state.filters;
        myFilters.indexOf(filter) === -1 ? myFilters.push(filter) : null;
        this.setState({
            filters : myFilters
              }, this.getRooms());
    }

    sortRooms() {
        let sortDir = '';
        if (!this.state.sortDir) {
            sortDir = 'ASC';
        } else {
            sortDir = this.reserveSortDir(this.state.sortDir);
        }
        this.setState({sortDir: sortDir}, this.getRooms());
        this.forceUpdate();
    }

    render() {
        let listEquip = ({room}) => room.equipements.map(function (equip, index) {
           return (<span
               className="equip btn btn-primary"
               key={index}
               onClick={(e) => {this.addFilter(equip.name); e.stopPropagation();}}>
               {equip.name}
                    </span>)
        }.bind(this));

        let listFilters = this.state.filters.map(function (filter, index) {
            return (
                <button className="btn btn-info"
                        key={index}
                        style={{marginLeft:15}}
                        onClick={() => this.removeFilter(filter)}>
                    {filter}
                </button>
            )
        }.bind(this));

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
                            <button className="btn" style={{float:'right'}} onClick={() => this.sortRooms()}>
                                Trier par place
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
