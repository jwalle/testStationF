import React from 'react';
import axios from 'axios';
import ReservationBox from './reservationBox.jsx';

class ContentPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rooms : [],
            user : 'julien',
            isOpen: false
        }
        this.getRooms = this.getRooms.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentWillMount() {
        this.getRooms();
    }

    toggleModal() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    getRooms() {
        let self = this;
        axios
            .get('/getRooms')
            // .then(res => console.log(res.data.rooms))
            .then(res => self.setState({
                rooms : res.data.rooms
            }))
            .catch(err => console.log('getRooms error : ' + err));
    }

    render() {
        let listEquip = ({room}) => room.equipements.map(function (equip, index) {
           return (<span className="equip btn btn-primary" key={index}>{equip.name} </span>)
        });

        let listRooms = this.state.rooms.map(function (room, index) {
            return (
                <tr key={index}>
                    <td> {room.name} </td>
                    <td> {room.description} </td>
                    <td>  {listEquip({room})} </td>
                    <td>  {room.capacity} </td>
                </tr>
            );}
        );

        return (
            <div className="container">
                <div className="row">
                    <h1>Content goes here !</h1>
                    <button onClick={this.toggleModal}>
                        Open the modal
                    </button>
                        <div className="col-md-8">
                        <table className="table table-hover table-striped">
                            <thead className="thead-inverse">
                            <tr>
                                <th style={{width:200}}>name</th>
                                <th style={{width:200}}>Description</th>
                                <th>equipements</th>
                                <th style={{width:20}}>place</th>
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
                    onClose={this.toggleModal}>
                        Contenu ici !
                </ReservationBox>
            </div>
    );
  }
}

export default ContentPage;
