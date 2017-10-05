import React from 'react';
import style from './Calendar.css';
import DatePicker from 'react-datepicker';
import CustomInput from './CustomInput.jsx';
import axios from 'axios';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

moment.locale('fr');
const hours = [8, 10, 12, 14, 16, 22];


class Calendar extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            selectedDate : moment(),
            selectedHour : 0,
            reserved : []
        };
        this.handleChange = this.handleChange.bind(this);
        this.setHour = this.setHour.bind(this);
    }
    componentWillMount() {
        this.handleChange(moment());
    }

    handleChange(date) {
        let self = this;
        let tmp = [];
        this.setState({
            startDate: date,
            selectedDate: date
        });
        hours.map(function(hour) {
            let day = date.clone().startOf('day');
             self.getIsReserved(day.add(hour, 'h'))
                 .then(res => {tmp[hour] = (res); return tmp;})
                 .then(tmp => {self.setState({reserved: tmp})})
                 .catch(err => console.log('error handleChange : ', err));
    });
}

    getIsReserved(dateTime) {
         return axios
                .get('http://localhost:3000/getIsReserved/' + this.props.roomIndex + '/' + dateTime.format('X'))
                .then(res => {return res.data;})
                .catch(err => console.log('get is reserved error : '  + err));
    }

    setIsReserved(dateTime) {
        let config = {
            withCredentials: true,
            headers: {'content-type': 'application/json'}
        };
        axios
            .post('http://localhost:3000/setIsReserved', {
                roomIndex: this.props.roomIndex,
                date: dateTime.format('X')
            }, config)
            .then(res => console.log('success !' + res))
            .catch(err => console.log('set reserved error : '  + err));
    }

    setHour(hour) {
        this.setState({selectedHour: hour});
    }

    makeReservation() {
        this.setIsReserved(this.state.selectedDate.add(this.state.selectedHour, 'h'));
        this.props.onClose();
    }

    render() {
        let self = this;
        let thisStyle;
        let thisHour = !!this.state.selectedHour;
        let reservButton =
            <button className={thisHour ? "btn btn-success" : "btn btn-success disabled"}
                    onClick={thisHour ? (() => this.makeReservation()) : ('')}>
                Confirmation
            </button>
        ;
        let listHours = hours.map(function(hour) {
            let day = self.state.selectedDate.startOf('day');
            let state = self.state.reserved[hour];
            if (state == false) {
                thisStyle = style.hCellFree;
                if(self.state.selectedHour == hour) {
                    thisStyle = style.hCellSelected;
                }
            } else {
                thisStyle = style.hCellBusy;
            }
            return (
                <span className=''
                      id={thisStyle}
                      key={hour}
                      onClick={state == false ? (() => self.setHour(hour)) : ('')}>
                    <p className={style.cellContent}>{hour + 'h00'}</p>
                    {state == false ? <p>Salle libre</p> : <p>Salle occupe</p>}
                </span>
            );
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
                    {reservButton}
                </div>
            </div>
        );
    }
}

export default Calendar;