import React from 'react';
import style from './reservationBox.css';
import Datetime from 'react-datetime';
import MyCalendar from './Calendar.jsx'


class ReservationBox extends React.Component{
    render() {
        if (!this.props.show) {
            return null;
        }

        return (

            <div>
                <div className={style.backdropStyle}></div>

                <div className={style.modalStyle}>
                    <div className={style.dialogStyle}>
                        <div className={style.modalContent}>
                            <h4 id={style.label}>Reservation de : {this.props.room.name}</h4>

                           <MyCalendar
                                room = {this.props.room}/>
                        </div>
                    <button onClick={this.props.onClose}>
                        Close
                    </button>
                </div>
              </div>
            </div>
        );
    }
}

export default ReservationBox;