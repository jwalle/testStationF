import React from 'react';
import style from './Calendar.css';
import DatePicker from 'react-datepicker';
import CustomInput from './CustomInput.jsx';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

moment.locale('fr');

class Calendar extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment()
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        const hours = [8, 10, 12, 14, 16, 18];
        let listHours = hours.map(function(hour) {
            if (hour == 10) {
                return (
                    <span className="" id={style.hCellFree} key={hour}>
                        <p className={style.cellContent}>{hour + 'h00'}</p>
                        <p>Salle libre</p>
                    </span>
                );
                } else {
                return (
                    <span className="" id={style.hCellBusy} key={hour}>
                        <p className={style.cellContent}>{hour + 'h00'}</p>
                        <p>Salle occupe</p>
                    </span>
            )
            }
        });

        return (
            <div id={style.mainRow}>
                <div className={style.container}>
                    <p className={style.choose}>Choix de la date</p>
                    <span className="glyphicon glyphicon-arrow-down"> </span>
                    <DatePicker customInput={<CustomInput />}
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                minDate={moment()}
                                placeholderText="choose a date"
                                withPortal
                    />
                    <p className={style.choose}>Choix de l'horaire</p>
                    <span className="glyphicon glyphicon-arrow-down"> </span>
                    <div className={style.rowHours}>
                        {listHours}
                    </div>
                    <span className="glyphicon glyphicon-arrow-down"> </span>
                    <button className="btn btn-success">Confirmation</button>
                </div>
            </div>
        );
    }
}

export default Calendar;