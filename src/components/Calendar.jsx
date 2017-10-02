import React from 'react';
import style from './Calendar.css';
import DatePicker from 'react-datepicker';
import CustomInput from './CustomInput.jsx';
import axios from 'axios';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

moment.locale('fr');

class Calendar extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            selectedDate : moment(),
            currentHour : 0,
            room : 'plop'
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });
    }

    getIsReserved(dateTime) {
        // console.log(dateTime.format('X'));
        console.log(this.props.params);
         axios
            .get('/getIsReserved/' + this.state.room + '/' + dateTime.format('X'))
            .then(res => console.log(res))
            .catch(err => console.log('get is reserved error : '  + err));
    }

    setIsReserved(dateTime) {
        axios
            .post('/setIsReserved' + dateTime)
            .catch(err => console.log('set reserved error : '  + err));
    }

    setHour(e) {
        this.setState({ currentHour : Number(e.target.key)})
    }

    render() {
        const hours = [8, 10, 12, 14, 16, 18];
        var self = this;
        let listHours = hours.map(function(hour) {
            var day = self.state.selectedDate.startOf('day');
            if (self.getIsReserved(day.add(hour, 'h'))) {
                return (
                    <span className=""
                          id={style.hCellFree}
                          key={hour}
                          onClick={self.setHour}
                    >
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
                    />

                    <p className={style.choose}>Choix de l'horaire</p>
                    <span className="glyphicon glyphicon-arrow-down"> </span>
                    <div className={style.rowHours}>
                        {listHours}
                    </div>
                    <span className="glyphicon glyphicon-arrow-down"> </span>
                    <button
                        className="btn btn-success"
                        onClick={this.setIsReserved(this.state.selectedDate.add(this.state.currentHour, 'h'))}
                    >Confirmation</button>
                </div>
            </div>
        );
    }
}

export default Calendar;