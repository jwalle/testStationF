import React from 'react';
import style from './Calendar.css';
import DatePicker from 'react-datepicker';
import CustomInput from './CustomInput.jsx';
import axios from 'axios';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

moment.locale('fr');
const hours = [8, 10, 12, 14, 16, 18];


class Calendar extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            selectedDate : moment(),
            currentHour : 0,
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
        this.setState({selectedDate: date});
        hours.map(function(hour) {
            let day = date.startOf('day');
             self.getIsReserved(day.add(hour, 'h'))
                 .then(res => {tmp[hour] = (res); return tmp;})
                 .then(tmp => self.setState({reserved: tmp}))
                 .catch(err => console.log('error handleChange : ', err));
    });
}

    getIsReserved(dateTime) {
         return axios
                .get('/getIsReserved/' + this.props.roomIndex + '/' + dateTime.format('X'))
                .then(res => {console.log(res.data) ;return res.data;})
                .catch(err => console.log('get is reserved error : '  + err));
    }

    setIsReserved(dateTime) {
        let config = {
            withCredentials: true,
            headers: {'content-type': 'application/json'}
        };
        axios
            .post('/setIsReserved', {
                roomIndex: this.props.roomIndex,
                date: dateTime.format('X')
            }, config)
            .then(res => console.log('success !' + res))
            .catch(err => console.log('set reserved error : '  + err));
    }

    setHour(hour) {
        this.setState({currentHour: hour});
    }

    makeReservation() {
        this.setIsReserved(this.state.selectedDate.add(this.state.currentHour, 'h'));
        this.props.onClose();
    }

    render() {
        let self = this;
        let thisStyle;
        let listHours = hours.map(function(hour) {
            let day = self.state.selectedDate.startOf('day');
            let state = self.state.reserved[hour];
            console.log(self.state.currentHour, hour);
            if (state == false) {
                thisStyle = style.hCellFree;
                if(self.state.currentHour == hour) {
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
                        {console.log('PLOP2')}
                    </div>
                    <span className="glyphicon glyphicon-arrow-down"> </span>
                    <button
                        className="btn btn-success"
                        onClick={ () => this.makeReservation()}
                    >Confirmation</button>
                </div>
            </div>
        );
    }
}

export default Calendar;