import React from 'react';
import style from './reservationBox.css';
import Datetime from 'react-datetime';



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
                            <p>Choix des dates :</p>

                            <div style="overflow:hidden;">
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div id="datetimepicker12"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

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